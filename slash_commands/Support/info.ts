import Command from "#structs/Command";

import discord from "discord.js";
import serverModel from "#models/guild.js";
export default new Command({
  command: new discord.SlashCommandBuilder()
    .setName("server")
    .setNameLocalizations({
      "en-US": "server",
      "pt-BR": "server",
    })
    .setDescription("Comando para pegar informacões sobre um servidor da black lotus")
    .setDescriptionLocalizations({
      "en-US": "Command to get information about a black lotus server",
      "pt-BR": "Comando para pegar informacões sobre um servidor da black lotus",
    })
    .addSubcommand((group) =>
      group
        .setName("info")
        .setNameLocalizations({
          "en-US": "info",
          "pt-BR": "info",
        })
        .setDescription("Informacões sobre um servidor da black lotus")
        .setDescriptionLocalizations({
          "en-US": "Information about a black lotus server",
          "pt-BR": "Informacões sobre um servidor da black lotus",
        })
        .addStringOption((option) =>
          option
            .setName("server")
            .setNameLocalizations({
              "en-US": "server",
              "pt-BR": "servidor",
            })
            .setDescription("Nome do servidor")
            .setDescriptionLocalizations({
              "en-US": "Server name",
              "pt-BR": "Nome do servidor",
            })
            .setRequired(true)
            .setAutocomplete(true),
        ),
    ),
  guilds: ["896047806454837278"],
  async run({ client, interaction }) {
    switch (interaction.options.getSubcommand()) {
      case "info":
        const server = interaction.options.getString("server");
        const guildData = await client.blackLotusManager.fetch(server).catch(() => {});
        const guild = await client.guilds.fetch(server).catch(() => {});
        if (!guildData || !guild)
          return interaction.reply({ content: "Servidor não encontrado", ephemeral: true });
        const owner = await client.users.fetch(guild.ownerId).catch(() => {});
        const rep = await client.users.fetch(guildData.representant);
        const embed = new discord.EmbedBuilder()
          .setTitle(`Informacões sobre o servidor ${guildData.data.modules.blackLotus.displayName}`)
          .setFields([
            {
              name: "Informacões gerais",
              value: `Nome do servidor: ${guild.name}
                                Nome de display: ${guildData.data.modules.blackLotus.displayName}
                                Id: ${guild.id}
                                Dono: ${owner ? owner.tag : guild.ownerId + " (Não encontrado)"}
                                Representante: ${
                                  guildData.representant
                                    ? `${rep.tag} (Id: ${guildData.representant})`
                                    : "Nenhum"
                                }
                        `,
            },
            {
              name: "Validacões",
              value: `Nome tem menos de 25 caracteres: ${
                guildData.data.modules.blackLotus.displayName.length <= 25
                  ? `Sim (${guildData.data.modules.blackLotus.displayName.length} Caracteres)`
                  : `Não (${guildData.data.modules.blackLotus.displayName.length} Caracteres)`
              }
                                 Bot tem permissão para criar invites: ${
                                   guild.members.me.permissions.has(
                                     discord.PermissionsBitField.Flags.CreateInstantInvite,
                                   )
                                     ? "Sim"
                                     : "Não"
                                 }
                                 Bot tem permissão para rastrear invites deletados: ${
                                   guild.members.me.permissions.has(
                                     discord.PermissionsBitField.Flags.ManageGuild,
                                   )
                                     ? "Sim"
                                     : "Não"
                                 }
                                `,
            },
            {
              name: "Configuracões",
              value: `Segue crescimento: ${
                guildData.data.modules.blackLotus.trackGrowth ? "Sim" : "Não"
              }
                            Aparece na embed: ${
                              guildData.data.modules.blackLotus.embedWorthy ? "Sim" : "Não"
                            }
                            Atualiza o nome automaticamente: ${
                              guildData.data.modules.blackLotus.trackNameChanges ? "Sim" : "Não"
                            }
                            `,
            },
          ])
          .setColor("#8800ff");
        await interaction.reply({ embeds: [embed], ephemeral: false });
        break;
    }
  },
  async autocomplete({ client, interaction }) {
    const servers = await serverModel
      .find({
        $or: [
          {
            "modules.blackLotus.displayName": new RegExp(
              interaction.options.getString("server"),
              "i",
            ),
          },
          { id: interaction.options.getString("info") },
        ],
      })
      .limit(25);
    const options = [];
    servers.forEach((server) => {
      options.push({
        name: server.modules.blackLotus.displayName,
        value: server.id,
      });
    });
    await interaction.respond(options);
  },
});
