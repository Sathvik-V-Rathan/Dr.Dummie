// Core elements
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const quitBtn = document.getElementById("quit-btn");

const caseDomainEl = document.getElementById("case-domain");
const caseTitleEl = document.getElementById("case-title");
const caseStemEl = document.getElementById("case-stem");
const optionsContainer = document.getElementById("options-container");
const feedbackEl = document.getElementById("feedback");
const explanationEl = document.getElementById("explanation");

const questionCounterEl = document.getElementById("question-counter");
const scoreChipEl = document.getElementById("score-chip");
const progressFillEl = document.getElementById("progress-fill");
const progressPercentEl = document.getElementById("progress-percent");
const timerChipEl = document.getElementById("timer-chip");

const domainFiltersEl = document.getElementById("domain-filters");

const finalScoreEl = document.getElementById("final-score");
const totalQuestionsEl = document.getElementById("total-questions");
const performanceLabelEl = document.getElementById("performance-label");
const accuracyValueEl = document.getElementById("accuracy-value");
const levelValueEl = document.getElementById("level-value");

let currentIndex = 0;
let score = 0;
let hasAnsweredCurrent = false;

let activeCases = [];
let totalQuestions = 0;

const ROUND_DURATION_SECONDS = 20 * 60; // 20-minute round
let remainingSeconds = ROUND_DURATION_SECONDS;
let timerId = null;

// 50+ clinically oriented dental scenarios
const cases = [
  {
    domain: "Operative",
    title: "Deep Occlusal Caries in a Young Adult",
    stem:
      "A 23‑year‑old presents with intermittent sensitivity to cold in tooth 36. " +
      "Clinically, there is a deep occlusal carious lesion, but the tooth is asymptomatic to percussion and shows a normal periapical radiograph. " +
      "Pulp testing suggests a normal response.",
    options: [
      "Indirect pulp capping followed by adhesive composite restoration",
      "Direct pulp capping and immediate full‑coverage crown",
      "Elective root canal treatment followed by onlay",
      "Extraction and replacement with single‑tooth implant",
    ],
    answerIndex: 0,
    explanation:
      "With a deep carious lesion and a vital pulp that responds normally to testing, conservative caries removal and an indirect pulp cap with a well‑sealed adhesive restoration is the recommended approach.",
  },
  {
    domain: "Endodontics",
    title: "Irreversible Pulpitis in a Mandibular Molar",
    stem:
      "A 31‑year‑old reports sharp spontaneous pain in tooth 46, worse at night and lingering with hot stimuli. " +
      "The tooth is not tender to percussion. Radiograph shows a deep distal carious lesion approximating the pulp but no periapical radiolucency.",
    options: [
      "Place sedative dressing and review in 6 months",
      "Perform root canal treatment of tooth 46",
      "Extraction and immediate implant placement",
      "No treatment; reassure and prescribe analgesics only",
    ],
    answerIndex: 1,
    explanation:
      "Lingering thermal pain, especially to heat, indicates symptomatic irreversible pulpitis. The indicated treatment is root canal therapy to remove the inflamed pulp while preserving the tooth.",
  },
  {
    domain: "Periodontics",
    title: "Generalized Chronic Periodontitis",
    stem:
      "A 52‑year‑old smoker presents with generalized bleeding on probing, 5–6 mm pockets, and horizontal bone loss affecting most posterior teeth. " +
      "There is no systemic condition reported.",
    options: [
      "Immediate full‑mouth extraction and complete dentures",
      "Oral prophylaxis every 2 years with no further treatment",
      "Initial non‑surgical periodontal therapy with scaling and root planing plus risk factor control",
      "Empiric systemic antibiotics alone without mechanical debridement",
    ],
    answerIndex: 2,
    explanation:
      "Generalized chronic periodontitis is best managed with non‑surgical periodontal therapy (scaling and root planing), reinforcement of oral hygiene, and modification of risk factors such as smoking.",
  },
  {
    domain: "Pediatric",
    title: "Early Childhood Caries in a Toddler",
    stem:
      "A 3‑year‑old child presents with multiple smooth‑surface caries on maxillary anterior teeth and molars. " +
      "The parents report the child sleeps with a bottle of sweetened milk.",
    options: [
      "Advise extraction of all carious teeth and no further counselling",
      "Dietary counselling, bottle‑feeding modification, topical fluoride and restorative care as needed",
      "Only prescribe antibiotics to prevent infection",
      "Do nothing until permanent teeth erupt",
    ],
    answerIndex: 1,
    explanation:
      "Early childhood caries requires behaviour and dietary modification, cessation of nocturnal bottle‑feeding with sugary liquids, topical fluoride, and appropriate restorative treatment to maintain primary teeth.",
  },
  {
    domain: "Oral Surgery",
    title: "Pericoronitis Around a Partially Erupted 38",
    stem:
      "A 27‑year‑old has pain and swelling around a partially erupted mandibular third molar (38), with an inflamed operculum and mild trismus. " +
      "There is no systemic involvement.",
    options: [
      "Irrigate under the operculum, provide analgesics and consider extraction of 38 after acute phase subsides",
      "Immediate extraction of 38 without addressing inflammation",
      "Only prescribe chlorhexidine mouthwash with no local measures",
      "No treatment; reassure the patient that it will resolve on its own",
    ],
    answerIndex: 0,
    explanation:
      "Acute pericoronitis is managed by local debridement and irrigation, pain control, and then reassessment; definitive extraction of the offending third molar is often planned once acute inflammation reduces.",
  },
  {
    domain: "Emergency",
    title: "Avulsed Permanent Incisor in a Child",
    stem:
      "An 11‑year‑old presents 30 minutes after avulsion of maxillary central incisor 11 during sports. " +
      "The tooth was stored in cold milk. There is no associated alveolar fracture.",
    options: [
      "Discard the tooth and plan a removable partial denture",
      "Replant the tooth gently, splint it and arrange endodontic treatment",
      "Delay replantation for 1 week to allow soft tissues to heal",
      "Decoronate and bury the root submucosally",
    ],
    answerIndex: 1,
    explanation:
      "An avulsed permanent tooth with open or closed apex should be replanted as soon as possible when stored appropriately; flexible splinting and subsequent endodontic management are indicated.",
  },
  {
    domain: "Prosthodontics",
    title: "Single Missing Mandibular First Molar",
    stem:
      "A 35‑year‑old with good oral hygiene is missing tooth 36. Adjacent teeth are intact and have small restorations only. " +
      "The patient prefers a fixed option and has adequate bone height.",
    options: [
      "Resin‑bonded bridge using 35 and 37 as abutments",
      "Single‑tooth implant‑supported crown to replace 36",
      "No replacement is ever required for a missing first molar",
      "Full‑arch removable partial denture",
    ],
    answerIndex: 1,
    explanation:
      "In a young patient with adequate bone and sound adjacent teeth, a single‑tooth implant is a conservative and functional fixed replacement that avoids preparation of neighbouring teeth.",
  },
  {
    domain: "Radiology",
    title: "Incidental Radiolucency in Posterior Mandible",
    stem:
      "A panoramic radiograph shows a well‑defined radiolucency below the mandibular canal in the right molar region. " +
      "The patient is asymptomatic and the overlying teeth are vital.",
    options: [
      "Consider a Stafne bone cavity and monitor periodically",
      "Immediate surgical curettage of the area",
      "Start empirical antibiotics for 2 weeks",
      "Extract all teeth in the quadrant",
    ],
    answerIndex: 0,
    explanation:
      "A well‑defined, static radiolucency below the mandibular canal in an asymptomatic patient is characteristic of a Stafne bone cavity, which is usually managed by observation rather than surgery.",
  },
  {
    domain: "Endodontics",
    title: "Symptomatic Apical Periodontitis",
    stem:
      "A 40‑year‑old complains of biting pain on tooth 26. The tooth has a large composite restoration, gives no response to cold testing, and is tender to percussion. " +
      "Radiograph shows widening of the periodontal ligament space at the apex.",
    options: [
      "Direct pulp capping",
      "Root canal treatment of tooth 26",
      "Vital pulpotomy only",
      "Extraction and immediate bridge placement",
    ],
    answerIndex: 1,
    explanation:
      "Non‑vital tooth with tenderness to percussion and PDL widening is consistent with symptomatic apical periodontitis; the treatment of choice is root canal therapy.",
  },
  {
    domain: "Operative",
    title: "Non‑Carious Cervical Lesion with Hypersensitivity",
    stem:
      "A 45‑year‑old complains of sharp sensitivity to cold at the cervical region of several premolars. " +
      "There is visible wedge‑shaped loss of tooth structure, with normal radiographs.",
    options: [
      "Advise only desensitizing toothpaste and ignore lesion morphology",
      "Restore cervical lesions with adhesive resin and address occlusal and brushing habits",
      "Perform root canal treatment on all sensitive teeth",
      "Extract premolars and replace with fixed partial denture",
    ],
    answerIndex: 1,
    explanation:
      "Non‑carious cervical lesions with hypersensitivity are managed by addressing etiologic factors (bruxism, traumatic brushing) and restoring with adhesive materials when sensitivity or structural loss is significant.",
  },
  // --- Additional concise clinically oriented cases (keep text compact) ---
  {
    domain: "Periodontics",
    title: "Isolated 7 mm Pocket on a Molar",
    stem:
      "A 50‑year‑old has an isolated 7 mm pocket on the distal aspect of 47 with a vertical defect. Tooth is vital and non‑mobile.",
    options: [
      "Extraction of 47",
      "Non‑surgical debridement only",
      "Consider surgical access with regenerative therapy if appropriate",
      "No treatment is needed for isolated pockets",
    ],
    answerIndex: 2,
    explanation:
      "Deep isolated vertical defects may benefit from surgical access and regenerative techniques after initial non‑surgical therapy.",
  },
  {
    domain: "Pediatric",
    title: "Pulpotomy in a Primary Molar",
    stem:
      "A 6‑year‑old has deep caries on primary molar 75. There is carious exposure with normal periapical radiograph and no spontaneous pain.",
    options: [
      "Indirect pulp cap only",
      "Formocresol pulpotomy or contemporary pulpotomy agent and stainless‑steel crown",
      "Extraction without space maintenance",
      "Root canal treatment as for permanent tooth",
    ],
    answerIndex: 1,
    explanation:
      "Vital primary molars with carious pulp exposure and no radicular pathology are commonly treated with pulpotomy and stainless‑steel crown.",
  },
  {
    domain: "Oral Pathology",
    title: "White Patch on Buccal Mucosa of a Smoker",
    stem:
      "A 55‑year‑old smoker has a persistent white plaque on the buccal mucosa that cannot be wiped off.",
    options: [
      "Reassure; all such lesions are benign",
      "Biopsy to rule out dysplasia or carcinoma and advise cessation of smoking",
      "Empirical antibiotics for 7 days",
      "Immediate hemimandibulectomy",
    ],
    answerIndex: 1,
    explanation:
      "Persistent leukoplakic lesions, especially in smokers, require biopsy to assess for dysplasia and counselling to stop tobacco use.",
  },
  {
    domain: "Emergency",
    title: "Acute Apical Abscess with Swelling",
    stem:
      "A 38‑year‑old presents with severe pain and localized fluctuant swelling adjacent to tooth 34, which is non‑vital.",
    options: [
      "Incision and drainage plus initiation of root canal therapy",
      "Only prescribe high‑dose analgesics",
      "Apply cold fomentation and review in 1 month",
      "Immediate extraction of adjacent healthy teeth",
    ],
    answerIndex: 0,
    explanation:
      "Acute apical abscess is treated with drainage of pus and elimination of infection source via root canal or extraction, supplemented with analgesia.",
  },
  {
    domain: "Prosthodontics",
    title: "Severely Worn Dentition with Loss of Vertical Dimension",
    stem:
      "A 60‑year‑old with generalized tooth wear presents with reduced lower facial height and poor aesthetics.",
    options: [
      "Do nothing; wear is age‑related",
      "Rehabilitate with occlusal splint and staged increase of vertical dimension with fixed or removable prostheses",
      "Extract all teeth immediately",
      "Only provide whitening treatment",
    ],
    answerIndex: 1,
    explanation:
      "Severe tooth wear with loss of vertical dimension requires careful occlusal assessment, often reversible splint therapy, and staged restorative rehabilitation.",
  },
  {
    domain: "Radiology",
    title: "Mixed Radiolucent–Radiopaque Lesion Around Apex of Mandibular Incisor",
    stem:
      "A 30‑year‑old female shows a mixed radiolucent–radiopaque lesion at the apex of a vital mandibular incisor.",
    options: [
      "Periapical cemento‑osseous dysplasia; usually observe",
      "Chronic apical periodontitis; start root canal therapy",
      "Osteosarcoma; immediate resection",
      "Radicular cyst; enucleation",
    ],
    answerIndex: 0,
    explanation:
      "Periapical cemento‑osseous dysplasia commonly presents as a mixed lesion at vital mandibular incisors and is often managed by observation.",
  },
  {
    domain: "Orthodontics",
    title: "Anterior Open Bite in a Thumb Sucker",
    stem:
      "An 8‑year‑old with prolonged thumb sucking presents with anterior open bite and proclined maxillary incisors.",
    options: [
      "Ignore until growth is complete",
      "Stop the habit, consider habit‑breaking appliance, then orthodontic correction if needed",
      "Extract upper incisors",
      "Immediate orthognathic surgery",
    ],
    answerIndex: 1,
    explanation:
      "Elimination of the etiologic habit is the first step; interceptive orthodontics may follow if malocclusion persists.",
  },
  {
    domain: "Infection Control",
    title: "Needlestick Injury While Treating Hepatitis B‑Positive Patient",
    stem:
      "A dentist sustains a percutaneous injury with a used needle from a known HBsAg‑positive patient.",
    options: [
      "Wash with soap and water, assess vaccination status, and consider post‑exposure prophylaxis",
      "Ignore if there is no visible blood",
      "Squeeze wound vigorously to increase bleeding and then ignore",
      "Only apply topical antiseptic and continue work",
    ],
    answerIndex: 0,
    explanation:
      "Standard management of needlestick injuries includes immediate washing, risk assessment, checking vaccination status, and appropriate post‑exposure prophylaxis.",
  },
  {
    domain: "Pharmacology",
    title: "Analgesic for Patient with Peptic Ulcer Disease",
    stem:
      "A 48‑year‑old with history of peptic ulcer disease requires analgesia after extraction of tooth 28.",
    options: [
      "High‑dose NSAIDs as first line",
      "Paracetamol (acetaminophen) in recommended doses",
      "Aspirin 600 mg every 4 hours",
      "No analgesia is safe in this patient",
    ],
    answerIndex: 1,
    explanation:
      "NSAIDs and aspirin can aggravate peptic ulcer disease; paracetamol is generally safer when used appropriately.",
  },
  {
    domain: "Operative",
    title: "Choice of Liner Under Deep Composite Restoration",
    stem:
      "A deep Class II cavity with remaining dentine thickness close to the pulp is being restored with composite resin.",
    options: [
      "Place calcium hydroxide liner at deepest point followed by resin‑modified glass ionomer base",
      "Place varnish and then amalgam",
      "Leave cavity floor bare and bulk‑fill composite",
      "Place zinc phosphate cement directly on pulp exposure",
    ],
    answerIndex: 0,
    explanation:
      "Calcium hydroxide liner can protect the pulp in deepest areas, with a glass ionomer base providing additional seal and fluoride release under composite.",
  },
  {
    domain: "Periodontics",
    title: "Drug‑Induced Gingival Enlargement",
    stem:
      "A 45‑year‑old on long‑term phenytoin therapy develops generalized gingival enlargement.",
    options: [
      "Stop all oral hygiene to avoid trauma",
      "Improve plaque control and consult physician regarding alternative medication",
      "Immediate full‑mouth gingivectomy without plaque control",
      "Treat with antibiotics only",
    ],
    answerIndex: 1,
    explanation:
      "Drug‑induced gingival enlargement is exacerbated by plaque; plaque control and medical consultation about substituting the drug are key steps.",
  },
  {
    domain: "Endodontics",
    title: "Missed MB2 Canal in Maxillary Molar",
    stem:
      "A previously root‑treated maxillary first molar 16 shows persistent periapical radiolucency on the mesiobuccal root.",
    options: [
      "Assume healing will occur without action",
      "Consider retreatment to locate and treat the additional MB2 canal",
      "Extract immediately",
      "Only prescribe analgesics repeatedly",
    ],
    answerIndex: 1,
    explanation:
      "Failure of maxillary molar root canal treatment often relates to untreated MB2 canals; endodontic retreatment with careful canal location is indicated.",
  },
  {
    domain: "Oral Medicine",
    title: "Recurrent Aphthous Ulcers",
    stem:
      "A 22‑year‑old presents with recurrent small, painful ulcers on non‑keratinized mucosa. Medical history is non‑contributory.",
    options: [
      "Topical corticosteroids and identification of possible triggers",
      "High‑dose systemic steroids for all episodes",
      "No treatment is ever needed",
      "Biopsy every ulcer immediately",
    ],
    answerIndex: 0,
    explanation:
      "Minor recurrent aphthous stomatitis is managed with topical corticosteroids, symptomatic relief and evaluation for predisposing factors.",
  },
  {
    domain: "Emergency",
    title: "Angina During Dental Treatment",
    stem:
      "A 60‑year‑old with history of stable angina develops chest pain and shortness of breath during a lengthy dental procedure.",
    options: [
      "Stop treatment, position patient comfortably, give nitroglycerin, monitor vitals, and activate emergency services if not relieved",
      "Ask patient to ignore the pain and continue",
      "Place patient supine with feet elevated aggressively",
      "Give high‑flow oxygen and continue the procedure",
    ],
    answerIndex: 0,
    explanation:
      "Chest pain suggestive of angina requires immediate interruption of treatment, nitroglycerin, monitoring and escalation if pain persists.",
  },
  {
    domain: "Pediatric",
    title: "Space Maintenance After Early Loss of Primary Molar",
    stem:
      "A 7‑year‑old has early loss of primary second molar with permanent first molar fully erupted and premolar germ present radiographically.",
    options: [
      "No space maintenance is ever required",
      "Consider fixed space maintainer to prevent mesial drift of first molar",
      "Extract the first permanent molar to balance occlusion",
      "Do nothing until premolar erupts",
    ],
    answerIndex: 1,
    explanation:
      "Early loss of primary second molar often requires space maintenance to prevent mesial migration of the permanent first molar.",
  },
  {
    domain: "Operative",
    title: "Post‑operative Sensitivity After Composite Restoration",
    stem:
      "A patient reports short, sharp pain to cold on a recently placed deep composite restoration on tooth 15. No spontaneous pain, normal radiograph.",
    options: [
      "Immediate root canal treatment",
      "Review occlusion, check for high spots, and monitor; consider bonding quality",
      "Extract tooth 15",
      "Prescribe long‑term antibiotics",
    ],
    answerIndex: 1,
    explanation:
      "Mild reversible sensitivity after deep composite can result from occlusal trauma or bonding stress; occlusal adjustment and observation are appropriate.",
  },
  {
    domain: "Prosthodontics",
    title: "Abutment Selection for Fixed Partial Denture",
    stem:
      "You plan a three‑unit bridge replacing 11 with 12 and 21 as abutments; both teeth have good periodontal support.",
    options: [
      "Proceed; abutment support appears adequate",
      "Use only 12 as single abutment",
      "Use only 21 as single abutment",
      "Add 22 and 23 as abutments routinely",
    ],
    answerIndex: 0,
    explanation:
      "Replacing one missing anterior tooth with two sound adjacent abutments is biomechanically acceptable in most cases.",
  },
  {
    domain: "Radiology",
    title: "Choice of Imaging for Suspected Mandibular Fracture",
    stem:
      "A 25‑year‑old after trauma has pain, malocclusion and limited opening; mandibular fracture is suspected.",
    options: [
      "Periapical radiographs only",
      "Panoramic radiograph, supplemented with CBCT if needed",
      "Occlusal view alone",
      "No imaging is required",
    ],
    answerIndex: 1,
    explanation:
      "Panoramic radiography is a first‑line investigation for suspected mandibular fractures, with CBCT used for detailed assessment.",
  },
  {
    domain: "Endodontics",
    title: "Reversible Pulpitis from Recent Restoration",
    stem:
      "A 28‑year‑old has sharp pain to cold on tooth 24 that subsides immediately after stimulus removal. Recent deep restoration present.",
    options: [
      "Diagnose reversible pulpitis and monitor with possible restoration adjustment",
      "Perform immediate root canal therapy",
      "Extract the tooth",
      "Prescribe only antibiotics",
    ],
    answerIndex: 0,
    explanation:
      "Non‑lingering pain provoked by cold suggests reversible pulpitis; addressing the cause and monitoring is indicated.",
  },
  {
    domain: "Orthodontics",
    title: "Premolar Extraction Decision in Crowding",
    stem:
      "A 14‑year‑old with severe bimaxillary crowding and protrusion seeks orthodontic treatment.",
    options: [
      "Consider extraction of first premolars as part of comprehensive treatment planning",
      "Extract all incisors",
      "Treat without any space management",
      "Extraction is never indicated",
    ],
    answerIndex: 0,
    explanation:
      "First premolar extraction is a common strategy to relieve severe crowding and protrusion when appropriate.",
  },
  {
    domain: "Periodontics",
    title: "Furcation Involvement in Mandibular Molar",
    stem:
      "A mandibular first molar has Grade II furcation involvement with good crown‑root ratio and adequate patient hygiene.",
    options: [
      "Extract immediately",
      "Maintain with furcation‑focused debridement and modified brushing aids; consider surgical access",
      "Do nothing and review in 5 years",
      "Root resection of both roots",
    ],
    answerIndex: 1,
    explanation:
      "Grade II furcations can often be maintained with meticulous debridement, appropriate instruments and, where indicated, surgical therapy.",
  },
  {
    domain: "Oral Surgery",
    title: "Indication for Coronectomy",
    stem:
      "Impacted 48 lies close to the inferior alveolar canal, with radiographic signs of intimate nerve relationship and no pathology.",
    options: [
      "Consider coronectomy to reduce risk to the nerve",
      "Always extract completely regardless of risk",
      "Leave tooth partially exposed without treatment",
      "Perform apicoectomy of all roots",
    ],
    answerIndex: 0,
    explanation:
      "Coronectomy can be considered when extraction carries high risk of inferior alveolar nerve injury and roots are otherwise healthy.",
  },
  {
    domain: "Pediatric",
    title: "Management of Primary Tooth Intrusion",
    stem:
      "A 3‑year‑old has intrusive luxation of a primary maxillary incisor with intrusion toward the labial plate and no sign of root impinging developing permanent tooth.",
    options: [
      "Allow for spontaneous reeruption and monitor",
      "Forceful repositioning and rigid splinting",
      "Immediate extraction of all anterior teeth",
      "Ignore and provide no follow‑up",
    ],
    answerIndex: 0,
    explanation:
      "Many intruded primary teeth reerupt spontaneously; observation is preferred unless there is risk to permanent successor.",
  },
  {
    domain: "Operative",
    title: "Caries Risk and Recall Interval",
    stem:
      "A patient with multiple recent carious lesions, poor diet and suboptimal hygiene completes restorative care.",
    options: [
      "Recall in 24 months regardless of risk",
      "Shorter recall interval (e.g., 3–6 months) with preventive focus",
      "No further follow‑up required",
      "Recall only if pain recurs",
    ],
    answerIndex: 1,
    explanation:
      "High‑risk patients benefit from shorter recall intervals to reinforce prevention and monitor for new lesions.",
  },
  {
    domain: "Prosthodontics",
    title: "Immediate Denture Planning",
    stem:
      "A 65‑year‑old requires extraction of remaining maxillary teeth and wants to avoid an edentulous period.",
    options: [
      "Plan immediate complete denture with post‑extraction adjustments",
      "Refuse prosthesis until 1 year after extractions",
      "No prosthesis is possible",
      "Offer only implants",
    ],
    answerIndex: 0,
    explanation:
      "Immediate dentures allow aesthetics and function immediately after extractions, with relines and adjustments as healing progresses.",
  },
  {
    domain: "Radiology",
    title: "Cone‑Beam CT for Implant Planning",
    stem:
      "A single implant is planned in the posterior mandible near the inferior alveolar canal.",
    options: [
      "Periapical radiograph is always sufficient",
      "CBCT is useful to assess three‑dimensional bone and nerve proximity",
      "Panoramic alone gives exact 3D detail",
      "No imaging is needed",
    ],
    answerIndex: 1,
    explanation:
      "CBCT provides 3D information about bone volume and critical structures, improving safety in implant planning.",
  },
  {
    domain: "Pharmacology",
    title: "Antibiotic Prophylaxis in Infective Endocarditis Risk",
    stem:
      "A patient with previous infective endocarditis requires invasive dental extraction.",
    options: [
      "Consider antibiotic prophylaxis according to current guidelines",
      "Never give antibiotics for any cardiac history",
      "Give random high‑dose steroids",
      "No medical history is relevant to dental care",
    ],
    answerIndex: 0,
    explanation:
      "Certain high‑risk cardiac conditions, including previous infective endocarditis, may warrant antibiotic prophylaxis for invasive dental procedures per guidelines.",
  },
  {
    domain: "Endodontics",
    title: "Cracked Tooth Syndrome",
    stem:
      "A 42‑year‑old has sharp pain on biting on tooth 36, especially on release, with normal radiograph and localized probing.",
    options: [
      "Suspect cracked tooth; consider cuspal coverage restoration after diagnostic tests",
      "Immediate extraction of 36",
      "Ignore; symptoms will always resolve",
      "Only prescribe mouthwash",
    ],
    answerIndex: 0,
    explanation:
      "Pain on release of biting is characteristic of cracked tooth; early diagnosis and cuspal coverage can preserve the tooth.",
  },
  {
    domain: "Oral Medicine",
    title: "Suspected Oral Squamous Cell Carcinoma",
    stem:
      "A 62‑year‑old tobacco user has an indurated ulcer on the lateral border of the tongue persisting for more than 3 weeks.",
    options: [
      "Arrange urgent biopsy and specialist referral",
      "Treat with topical steroids only",
      "Assume traumatic ulcer and ignore",
      "Prescribe antibiotics for 1 month",
    ],
    answerIndex: 0,
    explanation:
      "Persistent indurated ulcers in high‑risk sites and patients must be biopsied promptly to rule out malignancy.",
  },
  {
    domain: "Pediatric",
    title: "Fluoride Varnish in High‑Risk Child",
    stem:
      "A 5‑year‑old with multiple active caries and low socioeconomic background attends your clinic.",
    options: [
      "Topical fluoride varnish applications at regular intervals plus prevention counselling",
      "Avoid fluoride in children",
      "Extract all primary teeth immediately",
      "Only advise brushing with water",
    ],
    answerIndex: 0,
    explanation:
      "Fluoride varnish is effective in reducing caries risk in high‑risk children when combined with preventive education.",
  },
  {
    domain: "Operative",
    title: "Choice Between Amalgam and Composite in Large Posterior Restoration",
    stem:
      "A large MOD lesion in mandibular molar 37 in a low‑caries‑risk adult with good moisture control.",
    options: [
      "Either high‑copper amalgam or bonded composite, based on functional and aesthetic needs",
      "Only amalgam is acceptable",
      "Only composite is acceptable",
      "No restoration is needed",
    ],
    answerIndex: 0,
    explanation:
      "Both amalgam and composite can be appropriate; selection depends on caries risk, occlusal load, and aesthetic demand.",
  },
  {
    domain: "Periodontics",
    title: "Gingival Recession with Hypersensitivity",
    stem:
      "A 33‑year‑old presents with Miller Class I gingival recession on tooth 33 and root hypersensitivity.",
    options: [
      "Offer non‑surgical options first, and consider root coverage procedures if aesthetics or sensitivity persist",
      "Extract the tooth",
      "Ignore recession completely",
      "Only prescribe systemic antibiotics",
    ],
    answerIndex: 0,
    explanation:
      "Localized recession with good prognosis may be managed conservatively or with mucogingival surgery when indicated.",
  },
  {
    domain: "Prosthodontics",
    title: "Post Selection After Root Canal",
    stem:
      "Endodontically treated maxillary central incisor 11 has minimal coronal tooth structure remaining.",
    options: [
      "Consider fiber post with ferrule effect and full‑coverage crown",
      "Place large metal post without ferrule",
      "No restoration is required",
      "Extract and place removable partial denture",
    ],
    answerIndex: 0,
    explanation:
      "A fiber post with adequate ferrule and crown helps reinforce a severely compromised endodontically treated tooth.",
  },
  {
    domain: "Radiology",
    title: "Radiographic Caries Detection in Proximal Surfaces",
    stem:
      "You suspect early proximal caries on molars with no cavitation clinically.",
    options: [
      "Use bitewing radiographs for detection and monitoring",
      "Use panoramic alone",
      "No imaging is possible for proximal caries",
      "Only use periapical films from anterior region",
    ],
    answerIndex: 0,
    explanation:
      "Bitewing radiographs are the technique of choice for detecting and monitoring proximal caries in posterior teeth.",
  },
  {
    domain: "Endodontics",
    title: "Acute Irreversible Pulpitis Due to Cracked Cusp",
    stem:
      "A patient has severe lingering pain to cold on a maxillary premolar with a cracked cusp.",
    options: [
      "Root canal therapy and definitive cuspal coverage restoration",
      "Extraction only",
      "Topical desensitizing agent alone",
      "No treatment needed",
    ],
    answerIndex: 0,
    explanation:
      "Irreversible pulpitis with structural compromise requires endodontic therapy followed by cuspal protection.",
  },
  {
    domain: "Oral Surgery",
    title: "Dry Socket After Extraction",
    stem:
      "Three days after extraction of 38, a patient presents with severe throbbing pain and an empty socket with exposed bone.",
    options: [
      "Irrigate gently, place medicated dressing, and provide analgesics",
      "Curette vigorously to induce bleeding",
      "Suture socket closed without cleaning",
      "Prescribe antibiotics only",
    ],
    answerIndex: 0,
    explanation:
      "Alveolar osteitis is managed by gentle irrigation, medicated dressings and analgesia; aggressive curettage is contraindicated.",
  },
  {
    domain: "Pediatric",
    title: "MIH Affected First Permanent Molar",
    stem:
      "A 9‑year‑old has molar‑incisor hypomineralization (MIH) of 16 with post‑eruptive breakdown and sensitivity.",
    options: [
      "Seal or restore with glass ionomer/composite depending on severity and control sensitivity",
      "Extract immediately in all cases",
      "Ignore MIH lesions",
      "Only prescribe fluoride mouthwash without restoration",
    ],
    answerIndex: 0,
    explanation:
      "Management of MIH aims to control sensitivity and protect weakened enamel using sealants or restorations.",
  },
  {
    domain: "Operative",
    title: "Occlusal Caries Confined to Enamel",
    stem:
      "Bitewing radiograph shows a small occlusal carious lesion limited to enamel on tooth 26.",
    options: [
      "Non‑operative management with fluoride and monitoring",
      "Immediate extensive cavity preparation",
      "Root canal treatment",
      "Extraction",
    ],
    answerIndex: 0,
    explanation:
      "Enamel‑limited lesions without cavitation can often be managed non‑operatively with preventive measures.",
  },
  {
    domain: "Periodontics",
    title: "Diabetic Patient with Periodontitis",
    stem:
      "A 58‑year‑old with poorly controlled diabetes presents with generalized periodontitis.",
    options: [
      "Coordinate with physician to improve glycemic control plus periodontal therapy",
      "Delay all treatment indefinitely",
      "Treat periodontitis without considering diabetes",
      "Extract all teeth immediately",
    ],
    answerIndex: 0,
    explanation:
      "Periodontal health and glycemic control influence each other; coordinated medical and dental care improves outcomes.",
  },
  {
    domain: "Prosthodontics",
    title: "Occlusal Scheme for Complete Dentures",
    stem:
      "An elderly edentulous patient has high ridge resorption and unstable mandibular denture.",
    options: [
      "Consider lingualized occlusion or balanced occlusion to improve stability",
      "No attention to occlusal scheme is necessary",
      "Always arrange teeth in monoplane regardless of case",
      "Use natural tooth cusp heights without adjustment",
    ],
    answerIndex: 0,
    explanation:
      "Occlusal schemes like lingualized or balanced occlusion help improve denture stability in resorbed ridges.",
  },
  {
    domain: "Radiology",
    title: "Sialography Indication",
    stem:
      "A patient with suspected salivary gland obstruction presents with intermittent swelling at mealtimes.",
    options: [
      "Use sialography or appropriate imaging (e.g., ultrasound) to evaluate duct and gland",
      "Only panoramic radiograph is sufficient",
      "No imaging is indicated",
      "Use periapical film of anterior teeth",
    ],
    answerIndex: 0,
    explanation:
      "Dedicated salivary gland imaging, such as sialography or ultrasound, is used to evaluate ductal obstruction.",
  },
  {
    domain: "Endodontics",
    title: "Persistent Exudate During Root Canal",
    stem:
      "During root canal treatment of a maxillary molar, persistent serous exudate prevents dry canal.",
    options: [
      "Place calcium hydroxide intracanal medicament and schedule second visit",
      "Obturate canal in presence of exudate",
      "Abandon treatment",
      "Switch immediately to surgical approach",
    ],
    answerIndex: 0,
    explanation:
      "Intracanal medicaments like calcium hydroxide help control exudation and infection before obturation.",
  },
  {
    domain: "Oral Medicine",
    title: "Burning Mouth in Post‑Menopausal Woman",
    stem:
      "A 57‑year‑old post‑menopausal woman complains of burning sensation on tongue with normal mucosal appearance.",
    options: [
      "Consider burning mouth syndrome after excluding systemic causes",
      "Assume all symptoms are psychological and ignore",
      "Always treat as candidiasis",
      "Extract all remaining teeth",
    ],
    answerIndex: 0,
    explanation:
      "Burning mouth syndrome is a diagnosis of exclusion after ruling out causes like nutritional deficiencies, candidiasis, and xerostomia.",
  },
  {
    domain: "Emergency",
    title: "Syncope in Dental Chair",
    stem:
      "A young anxious patient loses consciousness briefly during injection and appears pale with slow pulse.",
    options: [
      "Position supine with legs elevated, maintain airway, monitor and reassure",
      "Place upright immediately",
      "Give large dose of insulin",
      "Ignore and continue procedure",
    ],
    answerIndex: 0,
    explanation:
      "Vasovagal syncope is managed by Trendelenburg‑like position, airway maintenance, and reassurance once recovered.",
  },
];

const TOTAL = cases.length;

function setScreen(screen) {
  [welcomeScreen, quizScreen, resultScreen].forEach((el) => {
    el.classList.toggle("active", el === screen);
  });
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function resetTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  remainingSeconds = ROUND_DURATION_SECONDS;
  timerChipEl.textContent = formatTime(remainingSeconds);
}

function startTimer() {
  resetTimer();
  timerId = setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      timerChipEl.textContent = "00:00";
      clearInterval(timerId);
      timerId = null;
      showResults(true);
      return;
    }
    timerChipEl.textContent = formatTime(remainingSeconds);
  }, 1000);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateHeader() {
  const total = totalQuestions || TOTAL;
  questionCounterEl.textContent = `${currentIndex + 1} / ${total}`;
  scoreChipEl.textContent = `Score: ${score}`;
}

function updateProgress() {
  const total = totalQuestions || TOTAL;
  const percent =
    total === 0 ? 0 : Math.round(((currentIndex + 1) / total) * 100);
  progressFillEl.style.width = `${percent}%`;
  progressPercentEl.textContent = `${percent}%`;
}

function initDomainFilters() {
  if (!domainFiltersEl) return;
  const domains = Array.from(new Set(cases.map((c) => c.domain))).sort();

  const allChip = document.createElement("button");
  allChip.className = "filter-chip active";
  allChip.dataset.domain = "ALL";
  allChip.textContent = "All domains";
  domainFiltersEl.appendChild(allChip);

  domains.forEach((domain) => {
    const chip = document.createElement("button");
    chip.className = "filter-chip";
    chip.dataset.domain = domain;
    chip.textContent = domain;
    domainFiltersEl.appendChild(chip);
  });

  domainFiltersEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("filter-chip")) return;

    const domain = target.dataset.domain;
    if (!domain) return;

    const allChipEl = domainFiltersEl.querySelector(
      '.filter-chip[data-domain="ALL"]'
    );

    if (domain === "ALL") {
      domainFiltersEl
        .querySelectorAll(".filter-chip")
        .forEach((chip) => chip.classList.toggle("active", chip === allChipEl));
      return;
    }

    target.classList.toggle("active");

    const activeDomainChips = Array.from(
      domainFiltersEl.querySelectorAll(
        '.filter-chip:not([data-domain="ALL"]).active'
      )
    );

    if (activeDomainChips.length > 0) {
      if (allChipEl) allChipEl.classList.remove("active");
    } else if (allChipEl) {
      allChipEl.classList.add("active");
    }
  });
}

function buildActiveCasesFromFilters() {
  if (!domainFiltersEl) {
    activeCases = [...cases];
    totalQuestions = activeCases.length;
    shuffle(activeCases);
    return;
  }

  const activeChips = Array.from(
    domainFiltersEl.querySelectorAll(".filter-chip.active")
  );
  const includesAll = activeChips.some(
    (chip) => chip.dataset.domain === "ALL"
  );

  if (includesAll || activeChips.length === 0) {
    activeCases = [...cases];
  } else {
    const selectedDomains = activeChips
      .map((chip) => chip.dataset.domain)
      .filter(Boolean);
    activeCases = cases.filter((c) => selectedDomains.includes(c.domain));
  }

  shuffle(activeCases);
  totalQuestions = activeCases.length;
}

function renderCase() {
  const set = activeCases.length > 0 ? activeCases : cases;
  const c = set[currentIndex];
  hasAnsweredCurrent = false;
  nextBtn.disabled = true;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  explanationEl.textContent = "";

  caseDomainEl.textContent = c.domain;
  caseTitleEl.textContent = c.title;
  caseStemEl.textContent = c.stem;

  optionsContainer.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  c.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.index = index.toString();

    const letterSpan = document.createElement("span");
    letterSpan.className = "option-letter";
    letterSpan.textContent = letters[index] || "";

    const textSpan = document.createElement("span");
    textSpan.className = "option-text";
    textSpan.textContent = opt;

    btn.appendChild(letterSpan);
    btn.appendChild(textSpan);

    btn.addEventListener("click", () => handleAnswer(index, btn));

    optionsContainer.appendChild(btn);
  });

  updateHeader();
}

function handleAnswer(selectedIndex, selectedBtn) {
  if (hasAnsweredCurrent) return;
  hasAnsweredCurrent = true;

  const set = activeCases.length > 0 ? activeCases : cases;
  const c = set[currentIndex];

  const optionButtons = optionsContainer.querySelectorAll(".option-btn");
  optionButtons.forEach((btn) => {
    btn.classList.add("disabled");
  });

  if (selectedIndex === c.answerIndex) {
    selectedBtn.classList.add("correct");
    feedbackEl.textContent = "Correct – well‑reasoned clinical choice.";
    feedbackEl.classList.add("correct");
    score += 1;
  } else {
    selectedBtn.classList.add("incorrect");
    const correctBtn = optionsContainer.querySelector(
      `.option-btn[data-index="${c.answerIndex}"]`
    );
    if (correctBtn) correctBtn.classList.add("correct");

    feedbackEl.textContent = "Not quite – review the reasoning below.";
    feedbackEl.classList.add("incorrect");
  }

  explanationEl.textContent = c.explanation;
  scoreChipEl.textContent = `Score: ${score}`;
  updateProgress();
  nextBtn.disabled = false;
}

function showResults(fromTimer = false) {
  setScreen(resultScreen);
  finalScoreEl.textContent = score.toString();
  const total = totalQuestions || TOTAL;
  totalQuestionsEl.textContent = total.toString();
  const accuracy = total === 0 ? 0 : Math.round((score / total) * 100);
  accuracyValueEl.textContent = `${accuracy}%`;

  let level;
  let label;
  if (accuracy >= 85) {
    level = "Clinic‑ready 🩺";
    label =
      "Excellent evidence‑based decisions. You’re functioning at a very strong clinical reasoning level.";
  } else if (accuracy >= 70) {
    level = "Competent ✅";
    label =
      "Solid performance with room to refine a few grey‑zone decisions. Revisit borderline cases.";
  } else if (accuracy >= 50) {
    level = "Developing 📚";
    label =
      "Your foundation is forming. Focus on pulpal diagnosis, perio planning, and emergency protocols.";
  } else {
    level = "Needs consolidation 🔍";
    label =
      "Use this as a roadmap. Review basic diagnostic criteria and standard treatment options.";
  }

  levelValueEl.textContent = level;
  performanceLabelEl.textContent = fromTimer
    ? `${label} Time for this round has elapsed.`
    : label;

  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function nextCase() {
  currentIndex += 1;
  const total = totalQuestions || TOTAL;
  if (currentIndex >= total) {
    showResults(false);
  } else {
    renderCase();
  }
}

function restart() {
  currentIndex = 0;
  score = 0;
  buildActiveCasesFromFilters();
  setScreen(quizScreen);
  renderCase();
  startTimer();
}

function quitRound() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  currentIndex = 0;
  score = 0;
  activeCases = [];
  totalQuestions = 0;
  questionCounterEl.textContent = "0 / 0";
  scoreChipEl.textContent = "Score: 0";
  progressFillEl.style.width = "0%";
  progressPercentEl.textContent = "0%";
  resetTimer();
  setScreen(welcomeScreen);
}

startBtn.addEventListener("click", () => {
  buildActiveCasesFromFilters();
  setScreen(quizScreen);
  currentIndex = 0;
  score = 0;
  renderCase();
  startTimer();
});

nextBtn.addEventListener("click", nextCase);
restartBtn.addEventListener("click", restart);
quitBtn.addEventListener("click", quitRound);

initDomainFilters();
timerChipEl.textContent = formatTime(ROUND_DURATION_SECONDS);
