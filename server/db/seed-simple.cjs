// 简化的种子数据脚本 - 手动插入测试数据
const { db, initializeDatabase } = require('./schema.cjs');

function seedSimpleData() {
  console.log('填充测试数据...');

  initializeDatabase();

  // 插入一个测试机器人
  const insertRobot = db.prepare(`
    INSERT INTO robots (
      id, name, manufacturer, origin, technology, estimated_cost,
      recovery_time, patient_rating, hospital_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRobot.run(
    1, 'MAKO', 'Stryker', '进口', '光学导航+触觉反馈',
    '8-12', '2-3周', 4.8, 120
  );

  // 插入适应症
  const insertIndication = db.prepare('INSERT INTO indications (robot_id, indication) VALUES (?, ?)');
  insertIndication.run(1, 'uka');
  insertIndication.run(1, 'tka');
  insertIndication.run(1, 'tha');

  // 插入一条新闻
  const insertNews = db.prepare(`
    INSERT INTO news (id, title, date, source, tag, tag_color, summary, is_hot)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertNews.run(
    1,
    '国家医保局发布手术机械臂辅助操作收费指南',
    '2024-12-25',
    '国家医保局',
    '政策',
    'bg-red-100 text-red-700',
    '明确手术机械臂辅助操作费分为导航、部分执行、精准执行三类',
    1
  );

  // 插入一个FAQ
  const insertFaq = db.prepare('INSERT INTO faqs (question, answer) VALUES (?, ?)');
  insertFaq.run(
    '骨科机器人手术安全吗？',
    '骨科机器人手术已在全球完成数百万例，安全性经过充分验证。'
  );

  console.log('✅ 测试数据填充完成');
}

if (require.main === module) {
  seedSimpleData();
  db.close();
}

module.exports = { seedSimpleData };
