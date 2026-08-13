function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function clean(value) {
  return String(value || "").trim().slice(0, 2000);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "POST, OPTIONS" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Neplatná data." }, 400);
  }

  const name = clean(payload.name).slice(0, 120);
  const email = clean(payload.email).slice(0, 200);
  const company = clean(payload.company).slice(0, 160);
  const need = clean(payload.need);

  if (!name || !email || !company || !need) {
    return json({ error: "Vyplňte všechna pole." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Neplatný e-mail." }, 400);
  }
  if (!env.RESEND_API_KEY) {
    return json({ error: "Odesílání e-mailu není nastavené." }, 500);
  }

  const to = env.CONTACT_TO || "janmartinek591@gmail.com";
  const from = env.RESEND_FROM || "PLUMB <poptavka@honzamartinek.work>";
  const text = [
    "Nová poptávka z webu PLUMB",
    "",
    "Jméno: " + name,
    "E-mail: " + email,
    "Firma: " + company,
    "",
    need,
  ].join("\n");

  const resend = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: "Poptávka PLUMB — " + company,
      text,
    }),
  });

  if (!resend.ok) {
    const detail = await resend.text();
    console.error("Resend error", resend.status, detail);
    return json({ error: "Odeslání se nepovedlo. Zkuste to znovu." }, 502);
  }

  return json({ ok: true });
}
