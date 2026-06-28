require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    Client,
    GatewayIntentBits,
    ChannelType,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

app.post("/checkout", async (req, res) => {

    const { username, cart, total } = req.body;

    const guild = client.guilds.cache.get("1516943017670480013");

    if (!guild)
        return res.status(404).send("Server not found");

    const channel = await guild.channels.create({
        name: `ticket-${username}`,
        type: ChannelType.GuildText,
        parent: "1517002613772521564",
        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel]
            }
        ]
    });

    let message = `## 🛒 New Order\n\n`;
    message += `**Player:** ${username}\n\n`;

    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity}\n`;
    });

    message += `\n💰 **Total:** ${total} EGP`;

    const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("🔒 Close Ticket")
        .setStyle(ButtonStyle.Danger)
);

await channel.send({
    content: message,
    components: [row]
});

    res.json({ success: true });

});

app.listen(3000, () => {
    console.log("🌐 API Running on port 3000");
});

client.login(process.env.TOKEN);
client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;

    if (interaction.customId === "close_ticket") {

        await interaction.reply({
            content: "🔒 Closing ticket in 5 seconds...",
            ephemeral: true
        });

        setTimeout(async () => {
            await interaction.channel.delete().catch(() => {});
        }, 5000);

    }

});