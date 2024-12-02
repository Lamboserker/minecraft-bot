const { SlashCommandBuilder } = require("@discordjs/builders");
const { queryFull } = require("minecraft-server-util");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Zeigt Informationen über den Minecraft-Server an.")
    .addStringOption((option) =>
      option
        .setName("ip")
        .setDescription("Die IP-Adresse des Servers")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("port")
        .setDescription("Der Query-Port des Servers")
        .setRequired(false)
    ),

  async execute(interaction) {
    const ip = interaction.options.getString("ip");
    const port = interaction.options.getInteger("port") || 25565;

    try {
      const serverInfo = await queryFull(ip, port);
      await interaction.reply({
        content: `**Server-Status**:
- **MOTD:** ${serverInfo.motd.clean}
- **Spieler:** ${serverInfo.players.online}/${serverInfo.players.max}
- **Version:** ${serverInfo.version}
- **Map:** ${serverInfo.map || "N/A"}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Fehler: Der Server konnte nicht abgefragt werden. Stelle sicher, dass die IP und der Port korrekt sind.",
        ephemeral: true,
      });
    }
  },
};
