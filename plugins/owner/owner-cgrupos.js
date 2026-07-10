// === COMANDO .cgrupos / /cgrupos / #cgrupos / @cgrupos (VERSIÓN DEBUG) ===
// Muestra todos los grupos donde está el bot, con su link de invitación.
// Solo lo pueden usar los dueños del bot (info sensible).
// Esta versión imprime logs en consola para diagnosticar por qué no responde.

export default {
  command: [".cgrupos", "/cgrupos", "#cgrupos", "@cgrupos"],
  category: "Owner",
  description: "Muestra todos los grupos donde está el bot junto a su link de invitación (solo owner).",
  ownerOnly: true,

  run: async (sock, msg, args, context) => {
    const { chatId } = context;
    console.log("🟢 [cgrupos] El plugin SÍ se ejecutó."); // si no ves esto, el comando no está matcheando

    try {
      console.log("🟡 [cgrupos] Pidiendo lista de grupos con groupFetchAllParticipating()...");
      const groups = await sock.groupFetchAllParticipating();
      const groupList = Object.values(groups);
      console.log(`🟡 [cgrupos] Grupos encontrados: ${groupList.length}`);

      if (groupList.length === 0) {
        return await sock.sendMessage(
          chatId,
          { text: "El bot no está en ningún grupo todavía." },
          { quoted: msg }
        );
      }

      const groupsInfo = [];
      for (const group of groupList) {
        let link = null;
        try {
          const code = await sock.groupInviteCode(group.id);
          link = `https://chat.whatsapp.com/${code}`;
        } catch (errLink) {
          console.log(`🟠 [cgrupos] No pude sacar link de "${group.subject}":`, errLink.message || errLink);
        }
        groupsInfo.push({
          subject: group.subject,
          members: group.participants.length,
          link,
        });
      }

      const listText = groupsInfo
        .map(
          (g, i) =>
            `${i + 1}. *${g.subject}*\n` +
            `   👤 Miembros: ${g.members}\n` +
            `   🔗 ${g.link || "No disponible (el bot no es admin ahí)"}`
        )
        .join("\n\n");

      const caption = `📋 *Grupos donde estoy* (${groupsInfo.length})\n\n${listText}`;

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

      console.log("🟡 [cgrupos] Intentando enviar mensaje con botones...");
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
        console.log("✅ [cgrupos] Mensaje con botones enviado.");
      } catch (errBotones) {
        console.log("🟠 [cgrupos] Fallaron los botones, mando solo texto. Error:", errBotones.message || errBotones);
        await sock.sendMessage(chatId, { text: caption }, { quoted: msg });
        console.log("✅ [cgrupos] Mensaje de solo texto enviado.");
      }
    } catch (errGeneral) {
      console.log("🔴 [cgrupos] ERROR GENERAL:", errGeneral);
      await sock.sendMessage(
        chatId,
        { text: `❌ Ocurrió un error al obtener los grupos:\n${errGeneral.message || errGeneral}` },
        { quoted: msg }
      );
    }
  },
};
