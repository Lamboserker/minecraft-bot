const { SlashCommandBuilder } = require("@discordjs/builders");
const { queryFull } = require("minecraft-server-util");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("colainfo")
    .setDescription("Zeigt Informationen über deinen Minecraft-Server an."),

  async execute(interaction) {
    const ip = "194.163.150.9"; // Server-IP
    const queryPort = 29965; // Query-Port

    try {
      const serverInfo = await queryFull(ip, queryPort);

      await interaction.reply({
        content: `**Server-Status**:
- **MOTD:** ${serverInfo.motd.clean}
- **Spieler:** ${serverInfo.players.online}/${serverInfo.players.max}
- **Version:** ${serverInfo.version}
- **Map:** ${serverInfo.map || "N/A"}
- **Ping:** ${serverInfo.latency}ms`,
        ephemeral: false, // Sichtbar für alle im Channel
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Fehler: Der Server konnte nicht abgefragt werden. Stelle sicher, dass der Server online ist.",
        ephemeral: true,
      });
    }
  },
};
