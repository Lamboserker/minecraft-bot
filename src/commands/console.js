const { SlashCommandBuilder } = require("@discordjs/builders");
const { Rcon } = require("rcon-client");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("console")
    .setDescription("Führe einen Konsolenbefehl auf dem Minecraft-Server aus.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription(
          "Der Konsolenbefehl, der auf dem Server ausgeführt werden soll."
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    const rconConfig = {
      host: "194.163.150.9", // Server-IP
      port: 29975, // RCON-Port
      password: "o0xQfv4i", // RCON-Passwort
    };

    const command = interaction.options.getString("command");

    try {
      const rcon = await Rcon.connect(rconConfig);
      const response = await rcon.send(command);
      await rcon.end();

      await interaction.reply({
        content: `**Konsolenbefehl ausgeführt:** \`${command}\`\n**Antwort:** \`${response}\``,
        ephemeral: false,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Fehler: Der Konsolenbefehl konnte nicht ausgeführt werden. Überprüfe die RCON-Einstellungen.",
        ephemeral: true,
      });
    }
  },
};
