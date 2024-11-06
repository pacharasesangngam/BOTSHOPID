const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

// Load data from data.json with logging
let data;
try {
  data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
  console.log('Data loaded successfully from data.json');
} catch (error) {
  console.error('Could not load data.json:', error);
  data = { users: {}, stock: {} };
}

// Function to save data with logging
const saveData = () => {
  try {
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    console.log('Data saved successfully to data.json');
  } catch (error) {
    console.error('Could not save data.json:', error);
  }
};

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

client.once('ready', () => {
  console.log('🎉 Bot is ready and online!');
});

client.on('messageCreate', async (message) => {
  console.log(`Received message from ${message.author.tag}: ${message.content}`);

  // Top-up command handling
  if (message.content.startsWith('!topup')) {
    const amount = parseInt(message.content.split(' ')[1], 10);
    console.log(`Attempting to top up with amount: ${amount}`);

    // Check if amount is valid
    if (isNaN(amount) || amount <= 0) {
      console.log('Invalid top-up amount entered');
      return message.reply('⚠️ Please enter a valid amount to top up.');
    }

    const userId = message.author.id;

    // Check if user is registered
    if (!data.users[userId]) {
      console.log(`User ${message.author.tag} attempted top-up without registering`);
      return message.reply('⚠️ You need to register first using the register button.');
    }

    // Update balance
    data.users[userId].balance += amount;
    console.log(`User ${message.author.tag} new balance: ${data.users[userId].balance}`);

    // Save data
    saveData();
    console.log('Data saved successfully after top-up');

    // Notify user
    return interaction.reply({
      content: `✅ Successfully topped up **${amount} baht**! Your new balance is **${data.users[userId].balance} baht**.`,
      ephemeral: true
    });
    
  }
 // การเพิ่มสต็อก
 if (message.content.startsWith('!addstock')) {
  if (!message.member.permissions.has('ADMINISTRATOR')) {
    return message.reply('❌ คุณไม่มีสิทธิ์ใช้คำสั่งนี้');
  }

  const args = message.content.split(' ').slice(1);
  const [price, id, password] = args;

  if (!price || isNaN(price) || !id || !password) {
    return message.reply('⚠️ การใช้งาน: `!addstock <ราคา> <ไอดี> <รหัสผ่าน>`');
  }

  const priceNumber = parseInt(price, 10);

  // เพิ่มสต็อกใหม่ตามราคาที่กำหนด
  if (!data.stock[priceNumber]) {
    data.stock[priceNumber] = [];
  }

  data.stock[priceNumber].push({ id, password });
  saveData();
  console.log(`เพิ่มไอดีเกมใหม่ในสต็อก: ราคา ${priceNumber}, ไอดี ${id}, รหัสผ่าน ${password}`);

  return message.reply(`✅ เพิ่มไอดีเกมใหม่ในสต็อกสำเร็จ สำหรับราคา **${priceNumber} บาท**.`);
}
if (message.content === '!store') {
  const storeEmbed = new EmbedBuilder()
    .setColor(0x34eb5b)
    .setTitle('🛒 ยินดีต้อนรับสู่ร้านขายไอดีเกม!')
    .setDescription(
      `เลือกซื้อไอดีเกมที่คุณต้องการได้จากด้านล่าง:\n\n` +
      '```' + // เปิดบล็อกโค้ดเพื่อสร้าง "กล่องข้อความ" รอบทั้งหมด
      '🔒 สินค้าทุกชิ้นผ่านการตรวจสอบและปลอดภัย\n' +
      '💳 รองรับการชำระเงินหลายช่องทาง\n' +
      '🕒 ร้านเปิดบริการตลอด 24 ชั่วโมง\n' +
      '📞 หากมีปัญหาการซื้อ กรุณาติดต่อทีมงาน 🎫' +
      '```' // ปิดบล็อกโค้ด
    )
    .addFields(
      {
        name: 'เเพ็กเกจ 1🍄',
        value: '```ราคา: 100 บาท\nรายละเอียด: ไอดีเห็ด 70K!```',
        inline: true,
      },
      {
        name: 'เเพ็กเกจ 2🍄',
        value: '```ราคา: 200 บาท\nรายละเอียด: ไอดีเห็ด 140K!```',
        inline: true,
      },
      {
        name: 'เเพ็กเกจ 3🍄',
        value: '```ราคา: 300 บาท\nรายละเอียด: ไอดีเห็ด 210K!```',
        inline: true,
      }
    )
    .setThumbnail('https://example.com/store-icon.png') // เพิ่มไอคอนร้าน (ถ้ามี URL)
    .setFooter({
      text: '🛒 ร้านเปิดตลอด 24 ชั่วโมง | ติดต่อทีมงานหากต้องการความช่วยเหลือ 🎫',
      iconURL: 'https://example.com/support-icon.png' // เพิ่มไอคอนของทีมงาน (ถ้ามี URL)
    });

    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('buy_game1')
          .setLabel('เเพ็กเกจ 1🍄')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('buy_game2')
          .setLabel('เเพ็กเกจ 2🍄')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('buy_game3')
          .setLabel('เเพ็กเกจ 3🍄')
          .setStyle(ButtonStyle.Danger)
      );

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('register')
          .setLabel('✍️ Register')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('topup')
          .setLabel('💰 Top Up')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('check_balance')
          .setLabel('💳 Check Balance')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('refresh_store')
          .setLabel('🔄 รีเฟรช')
          .setStyle(ButtonStyle.Primary)
      );

    await message.channel.send({ embeds: [storeEmbed], components: [row1, row2] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  
  const userId = interaction.user.id;
  console.log(`Button interaction received from ${interaction.user.tag}: ${interaction.customId}`);
  if (interaction.customId === 'refresh_store') {
    // ลบข้อความเดิมแล้วส่งข้อความใหม่ (การรีเฟรช)
    await interaction.channel.bulkDelete(100, true).catch(error => console.error('Failed to delete messages:', error));
  }
  // Register button handling
  if (interaction.customId === 'register') {
    if (!data.users[userId]) {
      data.users[userId] = { balance: 0 };
      saveData();
      const registerEmbed = new EmbedBuilder()
        .setColor(0x4caf50)
        .setDescription('✅ **Registration Successful!**\n\nWelcome to the Game ID Store. Your starting balance is **0 Baht**.');
      return interaction.reply({ embeds: [registerEmbed], ephemeral: true });
    } else {
      const alreadyRegisteredEmbed = new EmbedBuilder()
        .setColor(0xffa500)
        .setDescription('⚠️ **You are already registered.**');
      return interaction.reply({ embeds: [alreadyRegisteredEmbed], ephemeral: true });
    }
  }

  // Top-up button handling
  if (interaction.customId === 'topup') {
    const topUpPromptEmbed = new EmbedBuilder()
      .setColor(0x00bcd4)
      .setDescription('💰 **Top-Up Instructions**\n\nPlease enter the amount you want to top up by typing `!topup [amount]` (e.g., `!topup 100`).');
    return interaction.reply({ embeds: [topUpPromptEmbed], ephemeral: true });
  }

  // Check balance button handling
  if (interaction.customId === 'check_balance') {
    if (!data.users[userId]) {
      const noRegisterEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription('🚫 **You need to register first!**');
      return interaction.reply({ embeds: [noRegisterEmbed], ephemeral: true });
    }
    const balanceEmbed = new EmbedBuilder()
      .setColor(0x2196f3)
      .setDescription(`💳 **Your Current Balance:**\n\nYou have **${data.users[userId].balance} Baht**.`);
    return interaction.reply({ embeds: [balanceEmbed], ephemeral: true });
  }

  // Handle game purchases
  const priceList = {
    buy_game1: 100,
    buy_game2: 200,
    buy_game3: 300,
  };

  const price = priceList[interaction.customId];
  if (price) {
    if (!data.users[userId]) {
      console.log(`User ${interaction.user.tag} attempted to buy a game without registering`);
      return interaction.reply({ content: '⚠️ You need to register first!', ephemeral: true });
    }

    if (data.users[userId].balance < price) {
      console.log(`User ${interaction.user.tag} does not have enough balance for this purchase`);
      return interaction.reply({ content: '❌ Insufficient balance! Please top up to proceed.', ephemeral: true });
    }

    const gameAccount = getRandomGameAccount(price);
    if (!gameAccount) {
      console.log(`Out of stock for game ID at price: ${price}`);
      return interaction.reply({ content: '⚠️ Sorry, this game ID is currently out of stock. Please try again later.', ephemeral: true });
    }

    data.users[userId].balance -= price;
    saveData();
    console.log(`User ${interaction.user.tag} purchased game ID. New balance: ${data.users[userId].balance}`);

    try {
      await interaction.user.send(`🎉 **การซื้อสำเร็จ!** 🎉\n\nคุณได้ซื้อไอดีเกมในราคา **${price} บาท**\n\n🔑 **รายละเอียดไอดีเกม**:\n\`\`\`\nID: ${gameAccount.id}\nPassword: ${gameAccount.password}\n\`\`\`\n\n📩 **กรุณาเก็บข้อมูลนี้ไว้เป็นความลับ** และอย่าเปิดเผยให้ผู้อื่นทราบ หากพบปัญหาใด ๆ กรุณาติดต่อทีมสนับสนุน!`);
      console.log(`DM ส่งถึง ${interaction.user.tag} พร้อมไอดีเกม`);
      

      const purchaseSuccessEmbed = new EmbedBuilder()
        .setColor(0x4caf50)
        .setDescription('✅ **Purchase Completed!**\n\nCheck your DMs for the game ID details.');
      interaction.reply({ embeds: [purchaseSuccessEmbed], ephemeral: true });
    } catch (error) {
      console.error(`Failed to send DM to ${interaction.user.tag}:`, error);
      interaction.reply({
        content: '❌ Could not send DM. Please ensure your DMs are open and try again.',
        ephemeral: true
      });
    }
  }
});

const getRandomGameAccount = (price) => {
  const stock = data.stock[price];
  if (stock && stock.length > 0) {
    const randomIndex = Math.floor(Math.random() * stock.length);
    const selectedAccount = stock.splice(randomIndex, 1)[0];
    saveData(); // Save updated stock after removing an account
    return selectedAccount;
  }
  return null;
};

client.login('Discord');
