import type { APIRoute } from "astro";
import { Resend } from "resend";
import { site } from "../../lib/site";

export const prerender = false;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    if (data.get("website")) {
      return Response.json({ ok: true });
    }

    const name = String(data.get("name") ?? "").trim().slice(0, 120);
    const email = String(data.get("email") ?? "").trim().slice(0, 160);
    const phone = String(data.get("phone") ?? "").trim().slice(0, 40);
    const subject = String(data.get("subject") ?? "Contato pelo site").trim().slice(0, 160);
    const message = String(data.get("message") ?? "").trim().slice(0, 4000);

    if (!name || !email || !message) {
      return Response.json({ ok: false, error: "Preencha nome, email e mensagem." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: false, error: "Email inválido." }, { status: 400 });
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    const from = import.meta.env.RESEND_FROM ?? "contato@dantasesuppia.com.br";
    const to = import.meta.env.RESEND_TO ?? site.email;

    if (!apiKey) {
      console.error("RESEND_API_KEY ausente");
      return Response.json({ ok: false, error: "Configuração do servidor incompleta." }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const html = `
      <h2>Novo contato pelo site</h2>
      <p><strong>Nome:</strong> ${escape(name)}</p>
      <p><strong>Email:</strong> ${escape(email)}</p>
      ${phone ? `<p><strong>Telefone:</strong> ${escape(phone)}</p>` : ""}
      <p><strong>Assunto:</strong> ${escape(subject)}</p>
      <p><strong>Mensagem:</strong></p>
      <p style="white-space:pre-wrap">${escape(message)}</p>
    `;

    const { error } = await resend.emails.send({
      from: `Site Dantas & Suppia <${from}>`,
      to: [to],
      replyTo: email,
      subject: `[Site] ${subject}`,
      html,
    });

    if (error) {
      console.error("Resend error", error);
      return Response.json({ ok: false, error: "Falha ao enviar a mensagem." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Erro interno." }, { status: 500 });
  }
};
