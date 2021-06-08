require("dotenv").config();
const Rutracker = require("./torrent_trackers/rutracker");
const { Telegraf, Markup } = require("telegraf");
const ruTracker = new Rutracker();
const availableResolution = ["/720p", "/1080p", "/2160p"];

const welcomeMessage = (fname) => `Hello ${fname}.
I'm caveman bot.`;

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use()
bot.start((ctx) => {
  ctx.reply(welcomeMessage(ctx.from.first_name));
});

bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) =>
  {
    console.log(ctx.session);
    ctx.reply(
    `Hey ${ctx.from.first_name}
What are you looking for?
`,
    Markup.keyboard(["/movies", "/series"]).oneTime().resize()
  )}
);
bot.command("movies", (ctx) => {
  let query = "";
  let resolution = "";
  ctx.reply("Enter movie name");
  bot.on("text", (ctx) => {
    if (
      availableResolution.filter(
        (resolution) => resolution === ctx.message.text
      ).length === 0
    ) {
      query = ctx.message.text;
      ctx.reply(
        `Select resolution`,
        Markup.keyboard(availableResolution).oneTime().resize()
      );
    } else {
      resolution = ctx.message.text;
      ctx.reply(`It cat take a few moments. Please wait.`);
      ruTracker.getTorrents(query, resolution).then((torentList) => {
        if (torentList.length > 0)
          torentList.forEach((torrent) => {
            ctx.reply(torrent);
          });
        else ctx.reply("Nothing on your search");
      });
    }
  });

  // bot.command("1080p", (ctx) => {
  //   resolution = ctx.message.text;
  //   ctx.reply(`It cat take a few moments. Please wait.`, query);
  //   ruTracker
  //     .getTorrents(query, resolution)
  //     .then((torentList) => ctx.reply(torentList));
  // });
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
