// === COMANDO .cgrupos / /cgrupos / #cgrupos / @cgrupos ===
// Muestra todos los grupos donde está el bot, con su link de invitación
// en un botón. Solo lo pueden usar los dueños del bot (info sensible).

export default {
  command: [".cgrupos", "/cgrupos", "#cgrupos", "@cgrupos"],
  category: "Owner",
  description: "Muestra todos los grupos donde está el bot junto a su link de invitación (solo owner).",
  ownerOnly: true, // ya usa tu sistema centralizado de esOwner()/config.ownerNumber

  run: async (sock, msg, args, context) => {
    const { chatId } = context;

    const groups = await sock.groupFetchAllParticipating();
    const groupList = Object.values(groups);

    if (groupList.length === 0) {
      return await sock.sendMessage(
        chatId,
        { text: "El bot no está en ningún grupo todavía." },
        { quoted: msg }
      );
    }

    // Recolectamos el link de cada grupo (solo pedimos info, no enviamos nada aún)
    const groupsInfo = [];
    for (const group of groupList) {
      let link = null;
      try {
        const code = await sock.groupInviteCode(group.id);
        link = `https://chat.whatsapp.com/${code}`;
      } catch {
        // el bot no es admin en ese grupo, no puede sacar el link
      }
      groupsInfo.push({
        subject: group.subject,
        members: group.participants.length,
        link,
      });
    }

    // Texto único con todos los grupos
    const listText = groupsInfo
      .map(
        (g, i) =>
          `${i + 1}. *${g.subject}*\n` +
          `   👤 Miembros: ${g.members}\n` +
          `   🔗 ${g.link || "No disponible (el bot no es admin ahí)"}`
      )
      .join("\n\n");

    const caption = `📋 *Grupos donde estoy* (${groupsInfo.length})\n\n${listText}`;

    // Un botón por cada grupo que sí tenga link, todos en el mismo mensaje.
    // Nota: WhatsApp suele limitar cuántos botones se muestran/renderizan
    // bien en un solo mensaje (usualmente 3, a veces un poco más con
    // nativeFlow). Si tienes muchos grupos, algunos botones podrían no
    // aparecer aunque el texto sí liste todos.
    // Nota 2: interactiveButtons depende de que tu fork de Baileys lo
    // soporte. Si no funciona, cae automáticamente al mensaje de solo texto.
    const buttons = groupsInfo
      .filter((g) => g.link)
      .map((g) => ({
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text:
            g.subject.length > 20 ? g.subject.slice(0, 20) + "…" : g.subject,
          url: g.link,
          merchant_url: g.link,
        }),
      }));

    try {
      await sock.sendMessage(
        chatId,
        {
          text: caption,
          footer: "Toca un botón para abrir el grupo",
          interactiveButtons: buttons,
        },
        { quoted: msg }
      );
    } catch {
      // Fallback si el fork de Baileys no soporta botones: solo el texto con todos los links
      await sock.sendMessage(chatId, { text: caption }, { quoted: msg });
    }
  },
};
