import {
  Awaitable,
  ButtonInteraction,
  Client,
  ClientEvents,
  Collection,
  Guild,
  GuildMember,
  ModalSubmitInteraction,
  Role,
  TextChannel,
  VoiceState,
} from "discord.js";
import { Logger } from "winston";
import Command from "#structs/Command";
import BlackLotusManager from "#managers/BlackLotusManager";
import statusHandler from "#structs/Status";
import BlackLotusEmbed from "#structs/BlackLotusEmbed";
import { UpdateManager } from "#managers/UpdateManager";
import Event from "#structs/Event";
import GuildManager from "#managers/GuildManager";
import SyndicateManager from "#managers/SyndicateManager";

interface ExtendedClient extends Client {
  logger: Logger;

  statusHandler: statusHandler;

  blackLotus: Guild;

  commands: CommandsMap;

  blackLotusManager: BlackLotusManager;

  syndicateManager: SyndicateManager;

  guildManager: GuildManager;

  slashCommands: Collection<string, Command>;

  logChannel: TextChannel;

  events: Collection<string, Event>;

  mainEmbed: BlackLotusEmbed;

  updateManager: UpdateManager;

  on<K extends keyof ExtendedClientEvents>(
    event: K,
    listener: (...args: ExtendedClientEvents[K]) => Awaitable<void>
  ): this;

  on<S extends string | symbol>(
    event: Exclude<S, keyof ExtendedClientEvents>,
    listener: (...args: any[]) => Awaitable<void>
  ): this;

  once<K extends keyof ExtendedClientEvents>(
    event: K,
    listener: (...args: ExtendedClientEvents[K]) => Awaitable<void>
  ): this;

  once<S extends string | symbol>(
    event: Exclude<S, keyof ExtendedClientEvents>,
    listener: (...args: any[]) => Awaitable<void>
  ): this;

  emit<K extends keyof ExtendedClientEvents>(
    event: K,
    ...args: ExtendedClientEvents[K]
  ): boolean;

  emit<S extends string | symbol>(
    event: Exclude<S, keyof ExtendedClientEvents>,
    ...args: unknown[]
  ): boolean;

  off<K extends keyof ExtendedClientEvents>(
    event: K,
    listener: (...args: ExtendedClientEvents[K]) => Awaitable<void>
  ): this;

  off<S extends string | symbol>(
    event: Exclude<S, keyof ExtendedClientEvents>,
    listener: (...args: any[]) => Awaitable<void>
  ): this;

  removeAllListeners<K extends keyof ExtendedClientEvents>(event?: K): this;

  removeAllListeners<S extends string | symbol>(
    event?: Exclude<S, keyof ExtendedClientEvents>
  ): this;

  addMiddleware(func: (args: MiddlewareArgs) => Promise<boolean>): void;
}

export interface ExtendedClientEvents extends ClientEvents {
  roleAdded: [member: GuildMember, role: Role];
  roleRemoved: [member: GuildMember, role: Role];
  joinedVoiceChannel: [state: VoiceState];
  leftVoiceChannel: [state: VoiceState];
  movedVoiceChannel: [oldState: VoiceState, newState: VoiceState];
  newBoosterMember: [member: GuildMember];
  tick: [];
  [key: `button.${string}`]: [interaction: ButtonInteraction, args: string[]];
  [key: `modal.${string}`]: [
    interaction: ModalSubmitInteraction,
    args: string[]
  ];
}

/*
interface GuildDocument extends Document {
    id: string;
    blacklisted: boolean;
    blackLotus: {
        displayName: string;
        invite: string;
        constellation: {
            _id: string;
            name: string;
            defaultRoles: Array,
            position: number,
            minimumMemberAmmout: number,
            roleId: string
        }
        representant: string;
        staffs: Array<any>;
        role: string;
        embedWorthy: boolean;
        trackGrowth: boolean | null;
        trackNameChanges: boolean | null;
    };
    partnerships: {
        channelId: string | null;
        mentionId: string | null;
        message: string | null;
        timer: number | null;
        notify: boolean | null;
        notified: boolean | null;
    };
}
 */
