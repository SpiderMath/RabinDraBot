const { createCanvas, loadImage } = require("canvas");
const { MessageEmbed } = require("../../Util/Util");
// eslint-disable-next-line no-unused-vars
const { Message, MessageAttachment } = require("discord.js");
const { green } = require("../../Assets/JSON/colours.json");

module.exports = {
	name: "avatarfusion",
	description: "Fuses the avatar of two users",
	cPerms: ["ATTACH_FILES", "EMBED_LINKS"],
	minArgs: 1,
	/**
	 * @param {Message} message
	 */
	async run(message) {
		const msg = await message.channel.send(`${message.client.assets.emojis.loading} Processing your request..`);
		try {
			const baseUser = message.mentions.users.first() || message.author;
			const overlayUser = message.mentions.users.array()[1] || message.mentions.users.first();
			if(!overlayUser) return message.channel.send(`${message.client.assets.emojis.error} You didn't provide a valid user for overlay!`);
			const base = await loadImage(baseUser.displayAvatarURL({ dynamic: false, size: 512, format: "png" }));
			const overlay = await loadImage(overlayUser.displayAvatarURL({ dynamic: false, size: 512, format: "png" }));

			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext("2d");

			ctx.globalAlpha = 0.5;

			ctx.drawImage(base, 0, 0);
			ctx.drawImage(overlay, 0, 0);

			const fusedAvatarAttachment = new MessageAttachment(canvas.toBuffer(), "fused-avatar.png");

			const fusedAvatarEmbed = MessageEmbed(message.author, green)
				.setTitle(`Fusion of ${baseUser.tag} and ${overlayUser.tag}`)
				.attachFiles([fusedAvatarAttachment])
				.setImage("attachment://fused-avatar.png");

			message.channel.send(fusedAvatarEmbed).then(() => msg.delete());
		}
		catch(err) {
			message.channel.send(`SOmething went wrong please try again later!\n **Error: ** ${err.message}`).then(() => msg.delete());
		}
	},
};