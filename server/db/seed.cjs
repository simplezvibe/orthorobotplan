const { db, initializeDatabase } = require('./schema.cjs');
const fs = require('fs');
const path = require('path');

// 使用 process.cwd() 获取项目根目录
const projectRoot = process.cwd();

function loadDataFile(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const cleaned = content
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+{[^}]+}/g, '');

  const func = new Function(cleaned + '\nreturn { robots, indications, cameraOptions, armOptions, news, faqs, patientStories, surgicalTips, cities, anatomyEducation, pricingPolicies };');
  return func();
}

const robotsData = loadDataFile('src/data/robotsData.js');
const contentData = loadDataFile('src/data/contentData.js');

function seedDatabase() {
  console.log('Seeding database...');

  initializeDatabase();

  db.exec('DELETE FROM robots');
  db.exec('DELETE FROM indications');
  db.exec('DELETE FROM advantages');
  db.exec('DELETE FROM limitations');
  db.exec('DELETE FROM patient_benefits');
  db.exec('DELETE FROM hospitals');
  db.exec('DELETE FROM implant_compatibility');
  db.exec('DELETE FROM news');
  db.exec('DELETE FROM faqs');
  db.exec('DELETE FROM patient_stories');
  db.exec('DELETE FROM surgical_tips');
  db.exec('DELETE FROM cities');
  db.exec('DELETE FROM anatomy_education');
  db.exec('DELETE FROM anatomy_suitable');
  db.exec('DELETE FROM anatomy_advantages');
  db.exec('DELETE FROM anatomy_steps');
  db.exec('DELETE FROM pricing_policies');

  const insertRobot = db.prepare(`
    INSERT INTO robots (
      id, name, manufacturer, origin, nmpa, technology, accuracy,
      installations, evidence, color, image, recovery_time, pain_level,
      estimated_cost, hospital_count, patient_rating, success_rate,
      avg_operation_time, learning_curve, publications, clinical_trials,
      fda_clearance, ce_certification, arm_dof, arm_brand, camera_brand,
      navigation_system, haptic_feedback, real_time_tracking,
      software_version, service_network, training_program, annual_maintenance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertIndication = db.prepare('INSERT INTO indications (robot_id, indication) VALUES (?, ?)');
  const insertAdvantage = db.prepare('INSERT INTO advantages (robot_id, advantage) VALUES (?, ?)');
  const insertLimitation = db.prepare('INSERT INTO limitations (robot_id, limitation) VALUES (?, ?)');
  const insertPatientBenefit = db.prepare('INSERT INTO patient_benefits (robot_id, benefit) VALUES (?, ?)');
  const insertHospital = db.prepare('INSERT INTO hospitals (robot_id, hospital_name) VALUES (?, ?)');
  const insertImplant = db.prepare('INSERT INTO implant_compatibility (robot_id, implant) VALUES (?, ?)');

  robotsData.robots.forEach(robot => {
    insertRobot.run(
      robot.id, robot.name, robot.manufacturer, robot.origin, robot.nmpa,
      robot.technology, robot.accuracy, robot.installations, robot.evidence,
      robot.color, robot.image, robot.recoveryTime, robot.painLevel,
      robot.estimatedCost, robot.hospitalCount, robot.patientRating,
      robot.successRate, robot.avgOperationTime, robot.learningCurve,
      robot.publications, robot.clinicalTrials, robot.fdaClearance,
      robot.ceCertification, robot.armDOF, robot.armBrand, robot.cameraBrand,
      robot.navigationSystem, robot.hapticFeedback ? 1 : 0,
      robot.realTimeTracking ? 1 : 0, robot.softwareVersion,
      robot.serviceNetwork, robot.trainingProgram, robot.annualMaintenance
    );

    robot.indications?.forEach(ind => insertIndication.run(robot.id, ind));
    robot.advantages?.forEach(adv => insertAdvantage.run(robot.id, adv));
    robot.limitations?.forEach(lim => insertLimitation.run(robot.id, lim));
    robot.patientBenefits?.forEach(ben => insertPatientBenefit.run(robot.id, ben));
    robot.hospitals?.forEach(hos => insertHospital.run(robot.id, hos));
    robot.implantCompatibility?.forEach(imp => insertImplant.run(robot.id, imp));
  });

  console.log(`Inserted \${robotsData.robots.length} robots`);

  const insertNews = db.prepare(`
    INSERT INTO news (id, title, date, source, tag, tag_color, summary, is_hot)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  contentData.news.forEach(item => {
    insertNews.run(
      item.id, item.title, item.date, item.source, item.tag,
      item.tagColor, item.summary, item.isHot ? 1 : 0
    );
  });

  console.log(`Inserted \${contentData.news.length} news items`);

  const insertFaq = db.prepare('INSERT INTO faqs (question, answer) VALUES (?, ?)');
  contentData.faqs.forEach(faq => {
    insertFaq.run(faq.q, faq.a);
  });

  console.log(`Inserted \${contentData.faqs.length} FAQs`);

  const insertStory = db.prepare(`
    INSERT INTO patient_stories (id, name, age, surgery, robot, hospital, recovery, rating, comment, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  contentData.patientStories.forEach(story => {
    insertStory.run(
      story.id, story.name, story.age, story.surgery, story.robot,
      story.hospital, story.recovery, story.rating, story.comment, story.date
    );
  });

  console.log(`Inserted \${contentData.patientStories.length} patient stories`);

  const insertTip = db.prepare('INSERT INTO surgical_tips (category, tip) VALUES (?, ?)');
  contentData.surgicalTips.forEach(tipGroup => {
    tipGroup.tips.forEach(tip => {
      insertTip.run(tipGroup.title, tip);
    });
  });

  console.log('Inserted surgical tips');

  const insertCity = db.prepare('INSERT INTO cities (id, name, tier) VALUES (?, ?, ?)');
  contentData.cities.forEach(city => {
    insertCity.run(city.id, city.name, city.tier);
  });

  console.log(`Inserted \${contentData.cities.length} cities`);

  const insertAnatomy = db.prepare(`
    INSERT INTO anatomy_education (id, name, subtitle, description, duration, recovery, lifespan)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAnatomySuitable = db.prepare(`
    INSERT INTO anatomy_suitable (anatomy_id, type, item) VALUES (?, ?, ?)
  `);

  const insertAnatomyAdvantage = db.prepare(`
    INSERT INTO anatomy_advantages (anatomy_id, advantage) VALUES (?, ?)
  `);

  const insertAnatomyStep = db.prepare(`
    INSERT INTO anatomy_steps (anatomy_id, title, description, icon, step_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  Object.entries(contentData.anatomyEducation).forEach(([key, value]) => {
    insertAnatomy.run(
      key, value.name, value.subtitle, value.description,
      value.duration, value.recovery, value.lifespan
    );

    value.suitable?.forEach(item => {
      insertAnatomySuitable.run(key, 'suitable', item);
    });

    value.notSuitable?.forEach(item => {
      insertAnatomySuitable.run(key, 'not_suitable', item);
    });

    value.advantages?.forEach(adv => {
      insertAnatomyAdvantage.run(key, adv);
    });

    value.steps?.forEach((step, index) => {
      insertAnatomyStep.run(key, step.title, step.desc, step.icon, index);
    });
  });

  console.log('Inserted anatomy education data');

  const insertPolicy = db.prepare(`
    INSERT INTO pricing_policies (id, name, description, unit, category, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  contentData.pricingPolicies.forEach(policy => {
    insertPolicy.run(
      policy.id, policy.name, policy.description, policy.unit,
      policy.category, policy.note || null
    );
  });

  console.log(`Inserted \${contentData.pricingPolicies.length} pricing policies`);
  console.log('Database seeding complete!');
}

if (require.main === module) {
  seedDatabase();
  db.close();
}

module.exports = { seedDatabase };
