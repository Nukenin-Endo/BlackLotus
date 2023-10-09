import {SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder, EmbedBuilder} from "discord.js";
import Command from "../../classes/structs/Command";

export default new Command({
    command: new SlashCommandBuilder()
        .setName('send')
        .setDescription('.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand
            .setName('embed')
            .setDescription('Envia a embed da black lotus')
        ),
    guilds: ["896047806454837278", "921162438001447023"],
    async run({client, interaction}) {
        switch (interaction.options.getSubcommand()) {
            case 'embed':
                const attachment = new AttachmentBuilder('https://cdn.discordapp.com/attachments/920464336978337872/1116842995635982416/aaaa.png') // https://cdn.discordapp.com/attachments/920464336978337872/1079928972038635520/black_lotus_2.png
                const embed = new EmbedBuilder(await client.mainEmbed.getEmbedJson())
                const message = await interaction.channel.send({embeds: [embed], files: [attachment]})
                client.mainEmbed.message.msgId = message.id
                client.mainEmbed.message.channelId = message.channel.id
                client.mainEmbed.message.guildId = message.guild.id
                await client.mainEmbed.message.save()
                await interaction.reply({ephemeral: true, content: 'Embed enviada com sucesso'})
                break;
        }
    }
})