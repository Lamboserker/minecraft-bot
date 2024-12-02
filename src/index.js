require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, Collection, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent, // Falls du Nachrichteninhalte benötigst
  ],
});

client.commands = new Collection();

// Definiere die erlaubte Kanal-ID
const allowedChannelId = "1313150143205216358"; // Ersetze mit der ID des gewünschten Kanals

// Lese alle Befehlsdateien und füge sie hinzu
const commandFiles = fs
  .readdirSync(path.join(__dirname, "src", "commands")) // Hier den absoluten Pfad verwenden
  .filter((file) => file.endsWith(".js"));

commandFiles.forEach((commandFile) => {
  const command = require(path.join(__dirname, "src", "commands", commandFile)); // Absoluter Pfad für das Laden der Dateien
  client.commands.set(command.data.name, command);
});

// Wenn der Bot bereit ist
client.once("ready", () => {
  console.log(
    `Ready! Logged in as ${client.user.tag}! I'm on ${client.guilds.cache.size} guild(s)!`
  );
  client.user.setActivity({ name: "mit dem Code", type: "PLAYING" });
});

// Wenn eine Interaktion erstellt wird (Befehl ausgeführt)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  // Sicherstellen, dass die Interaktion aus einem Textkanal stammt
  if (!interaction.guild) {
    return interaction.reply({
      content: "Dieser Bot funktioniert nur auf Servern.",
      ephemeral: true,
    });
  }

  console.log("Interaktion Kanal-ID:", interaction.channel?.id); // Kanal-ID prüfen
  console.log("Interaktion Kanal Objekt:", interaction.channel); // Kanalobjekt prüfen

  // Überprüfe, ob die Interaktion im richtigen Kanal stattfindet
  if (!interaction.channel || interaction.channel.id !== allowedChannelId) {
    console.error("Kanal nicht gefunden oder ungültig.");
    return interaction.reply({
      content: "Dieser Befehl kann nur im richtigen Kanal verwendet werden.",
      ephemeral: true,
    });
  }

  const command = client.commands.get(interaction.commandName);

  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      if (interaction.deferred || interaction.replied) {
        interaction.editReply(
          "Es gab einen Fehler bei der Ausführung dieses Befehls!"
        );
      } else {
        interaction.reply(
          "Es gab einen Fehler bei der Ausführung dieses Befehls!"
        );
      }
    }
  }
});

// Logge den Bot ein
client.login(process.env.DISCORD_BOT_TOKEN);
