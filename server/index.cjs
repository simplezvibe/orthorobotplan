const express = require('express');
const cors = require('cors');
const { db, initializeDatabase } = require('./db/schema.cjs');
const { seedSimpleData } = require('./db/seed-simple.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库（如果数据库为空，则填充数据）
initializeDatabase();

// 检查是否需要填充数据
try {
  const robotCount = db.prepare('SELECT COUNT(*) as count FROM robots').get();
  if (robotCount.count === 0) {
    console.log('📦 数据库为空，正在填充初始数据...');
    seedSimpleData();
  } else {
    console.log(`✅ 数据库已有 ${robotCount.count} 个机器人数据`);
  }
} catch (error) {
  console.log('⏭️  跳过数据填充检查');
}

// ==================== API 路由 ====================

// 获取所有机器人（包含关联数据）
app.get('/api/robots', (req, res) => {
  try {
    const robots = db.prepare(`
      SELECT * FROM robots
    `).all();

    // 为每个机器人添加关联数据
    const robotsWithDetails = robots.map(robot => {
      const indications = db.prepare('SELECT indication FROM indications WHERE robot_id = ?').all(robot.id);
      const advantages = db.prepare('SELECT advantage FROM advantages WHERE robot_id = ?').all(robot.id);
      const limitations = db.prepare('SELECT limitation FROM limitations WHERE robot_id = ?').all(robot.id);
      const patientBenefits = db.prepare('SELECT benefit FROM patient_benefits WHERE robot_id = ?').all(robot.id);
      const hospitals = db.prepare('SELECT hospital_name FROM hospitals WHERE robot_id = ?').all(robot.id);
      const implants = db.prepare('SELECT implant FROM implant_compatibility WHERE robot_id = ?').all(robot.id);

      return {
        ...robot,
        indications: indications.map(i => i.indication),
        advantages: advantages.map(a => a.advantage),
        limitations: limitations.map(l => l.limitation),
        patientBenefits: patientBenefits.map(p => p.benefit),
        hospitals: hospitals.map(h => h.hospital_name),
        implantCompatibility: implants.map(i => i.implant),
        hapticFeedback: Boolean(robot.haptic_feedback),
        realTimeTracking: Boolean(robot.real_time_tracking),
        // 转换snake_case到camelCase
        recoveryTime: robot.recovery_time,
        painLevel: robot.pain_level,
        estimatedCost: robot.estimated_cost,
        hospitalCount: robot.hospital_count,
        patientRating: robot.patient_rating,
        successRate: robot.success_rate,
        avgOperationTime: robot.avg_operation_time,
        learningCurve: robot.learning_curve,
        clinicalTrials: robot.clinical_trials,
        fdaClearance: robot.fda_clearance,
        ceCertification: robot.ce_certification,
        armDOF: robot.arm_dof,
        armBrand: robot.arm_brand,
        cameraBrand: robot.camera_brand,
        navigationSystem: robot.navigation_system,
        softwareVersion: robot.software_version,
        serviceNetwork: robot.service_network,
        trainingProgram: robot.training_program,
        annualMaintenance: robot.annual_maintenance
      };
    });

    res.json(robotsWithDetails);
  } catch (error) {
    console.error('获取机器人数据错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个机器人
app.get('/api/robots/:id', (req, res) => {
  try {
    const robot = db.prepare('SELECT * FROM robots WHERE id = ?').get(req.params.id);
    if (!robot) {
      return res.status(404).json({ error: '机器人未找到' });
    }

    const indications = db.prepare('SELECT indication FROM indications WHERE robot_id = ?').all(robot.id);
    const advantages = db.prepare('SELECT advantage FROM advantages WHERE robot_id = ?').all(robot.id);
    const limitations = db.prepare('SELECT limitation FROM limitations WHERE robot_id = ?').all(robot.id);
    const patientBenefits = db.prepare('SELECT benefit FROM patient_benefits WHERE robot_id = ?').all(robot.id);
    const hospitals = db.prepare('SELECT hospital_name FROM hospitals WHERE robot_id = ?').all(robot.id);
    const implants = db.prepare('SELECT implant FROM implant_compatibility WHERE robot_id = ?').all(robot.id);

    res.json({
      ...robot,
      indications: indications.map(i => i.indication),
      advantages: advantages.map(a => a.advantage),
      limitations: limitations.map(l => l.limitation),
      patientBenefits: patientBenefits.map(p => p.benefit),
      hospitals: hospitals.map(h => h.hospital_name),
      implantCompatibility: implants.map(i => i.implant),
      hapticFeedback: Boolean(robot.haptic_feedback),
      realTimeTracking: Boolean(robot.real_time_tracking)
    });
  } catch (error) {
    console.error('获取机器人错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取新闻
app.get('/api/news', (req, res) => {
  try {
    const news = db.prepare('SELECT * FROM news ORDER BY date DESC').all();
    const newsWithBooleans = news.map(item => ({
      ...item,
      isHot: Boolean(item.is_hot),
      tagColor: item.tag_color
    }));
    res.json(newsWithBooleans);
  } catch (error) {
    console.error('获取新闻错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取FAQ
app.get('/api/faqs', (req, res) => {
  try {
    const faqs = db.prepare('SELECT * FROM faqs').all();
    const faqsFormatted = faqs.map(faq => ({
      q: faq.question,
      a: faq.answer
    }));
    res.json(faqsFormatted);
  } catch (error) {
    console.error('获取FAQ错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取患者故事
app.get('/api/patient-stories', (req, res) => {
  try {
    const stories = db.prepare('SELECT * FROM patient_stories ORDER BY date DESC').all();
    res.json(stories);
  } catch (error) {
    console.error('获取患者故事错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取手术提示
app.get('/api/surgical-tips', (req, res) => {
  try {
    const tips = db.prepare('SELECT * FROM surgical_tips').all();

    // 按category分组
    const grouped = {};
    tips.forEach(tip => {
      if (!grouped[tip.category]) {
        grouped[tip.category] = {
          title: tip.category,
          tips: []
        };
      }
      grouped[tip.category].tips.push(tip.tip);
    });

    res.json(Object.values(grouped));
  } catch (error) {
    console.error('获取手术提示错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取城市数据
app.get('/api/cities', (req, res) => {
  try {
    const cities = db.prepare('SELECT * FROM cities').all();
    res.json(cities);
  } catch (error) {
    console.error('获取城市错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取解剖学教育数据
app.get('/api/anatomy-education', (req, res) => {
  try {
    const anatomies = db.prepare('SELECT * FROM anatomy_education').all();

    const result = {};
    anatomies.forEach(anatomy => {
      const suitable = db.prepare(`
        SELECT item FROM anatomy_suitable WHERE anatomy_id = ? AND type = 'suitable'
      `).all(anatomy.id);

      const notSuitable = db.prepare(`
        SELECT item FROM anatomy_suitable WHERE anatomy_id = ? AND type = 'not_suitable'
      `).all(anatomy.id);

      const advantages = db.prepare(`
        SELECT advantage FROM anatomy_advantages WHERE anatomy_id = ?
      `).all(anatomy.id);

      const steps = db.prepare(`
        SELECT * FROM anatomy_steps WHERE anatomy_id = ? ORDER BY step_order
      `).all(anatomy.id);

      result[anatomy.id] = {
        name: anatomy.name,
        subtitle: anatomy.subtitle,
        description: anatomy.description,
        duration: anatomy.duration,
        recovery: anatomy.recovery,
        lifespan: anatomy.lifespan,
        suitable: suitable.map(s => s.item),
        notSuitable: notSuitable.map(s => s.item),
        advantages: advantages.map(a => a.advantage),
        steps: steps.map(s => ({
          title: s.title,
          desc: s.description,
          icon: s.icon
        }))
      };
    });

    res.json(result);
  } catch (error) {
    console.error('获取解剖学教育数据错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取医保政策
app.get('/api/pricing-policies', (req, res) => {
  try {
    const policies = db.prepare('SELECT * FROM pricing_policies').all();
    res.json(policies);
  } catch (error) {
    console.error('获取医保政策错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取适应症选项
app.get('/api/indications', (req, res) => {
  try {
    const indications = [
      { id: 'all', name: '全部', icon: '🔍' },
      { id: 'uka', name: '单髁置换', icon: '🦵' },
      { id: 'tka', name: '全膝置换', icon: '🦴' },
      { id: 'tha', name: '全髋置换', icon: '🏥' }
    ];
    res.json(indications);
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取相机选项
app.get('/api/camera-options', (req, res) => {
  try {
    const cameras = db.prepare('SELECT DISTINCT camera_brand FROM robots').all();
    const options = ['all', ...cameras.map(c => c.camera_brand)];
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取机械臂选项
app.get('/api/arm-options', (req, res) => {
  try {
    const arms = db.prepare('SELECT DISTINCT arm_brand FROM robots').all();
    const options = ['all', ...arms.map(a => a.arm_brand)];
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '骨科机器人API运行正常' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
🚀 服务器已启动！
📡 API地址: http://localhost:${PORT}
🏥 骨科机器人智选平台后端
  `);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 正在关闭服务器...');
  db.close();
  process.exit(0);
});
