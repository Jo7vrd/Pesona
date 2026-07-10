/**
 * Terjemahan konten fallback (EN/ZH), dikunci per id/nilai. Saat backend
 * live, terjemahan konten dipindah ke kolom per-entri di database dan
 * dikelola lewat admin; berkas ini hanya melayani mode fallback/demo.
 */

export interface ContentTr {
  en: string;
  zh: string;
}

export const makananDescTr: Record<number, ContentTr> = {
  1: {
    en: "Kei's signature cassava crisp, dried then fried: crunchy outside, savoury inside, a favourite with afternoon coffee. Embal is the Kei staple that keeps for months.",
    zh: "凯岛招牌木薯脆饼，晒干后油炸，外脆内香，是下午咖啡的好搭档。Embal是凯岛可存放数月的主食。",
  },
  2: {
    en: "Reef fish landed that very day, grilled with Maluku rica spices and served with embal. Kei fishermen take only what they need; freshness is the main seasoning.",
    zh: "当日捕捞的珊瑚礁鲜鱼，配马鲁古rica香料炭烤，与embal同食。凯岛渔民取之有度，新鲜便是最好的调味。",
  },
  3: {
    en: "A Maluku salad of grated coconut, anchovies, and fresh vegetables with a squeeze of citrus: fresh and rich in spice, usually eaten with embal or boiled cassava.",
    zh: "马鲁古特色沙拉：椰丝、鳀鱼与新鲜蔬菜，挤上柑橘汁，清爽多香，常配embal或水煮木薯。",
  },
  4: {
    en: "Fresh seaweed salad from Kei waters, dressed with grated coconut and chilli: a coastal dish found only here. The seaweed is picked from the shallows at low tide.",
    zh: "凯岛海域的新鲜海藻沙拉，拌椰丝与辣椒，唯此地才有的海滨风味。海藻采自退潮时的浅滩。",
  },
  5: {
    en: "A clear, tangy fish soup with bilimbi and lemon basil. Kei home cooking that warms you up after a day at sea.",
    zh: "清爽酸香的鱼汤，加入木胡瓜与柠檬罗勒，是出海归来暖身的凯岛家常菜。",
  },
  6: {
    en: "Embal pressed into flower shapes and baked, often called embal love. A sweet-savoury snack and Kei's classic souvenir.",
    zh: "压成花形烘烤的embal，常被称为embal love。甜咸交织的小吃，是凯岛经典伴手礼。",
  },
  7: {
    en: "A warm ginger drink with palm sugar and a sprinkle of kenari nuts, passed down through generations in Maluku. Best enjoyed with the evening sea breeze.",
    zh: "姜汁热饮，加棕榈糖与坚果碎，马鲁古世代相传。傍晚海风中来一杯最惬意。",
  },
  8: {
    en: "Fresh juice from nutmeg fruit, Maluku's spice heritage in a glass. Sweet, slightly tart, and very refreshing at midday.",
    zh: "肉豆蔻果肉鲜榨果汁，一杯尽享马鲁古香料风华。香甜微涩，午间解暑。",
  },
};

export const budayaDescTr: Record<number, ContentTr> = {
  1: {
    en: "A customary ban on harvesting the sea at certain times and places. Sasi has kept Kei's reefs and fish stocks thriving for centuries, local wisdom now recognised as modern conservation. Violations are settled through customary deliberation.",
    zh: "在特定时间与海域禁止捕捞的习俗。数百年来，Sasi守护着凯岛的珊瑚礁与鱼群，这一地方智慧如今被视为现代保护实践。违者由部族协商裁决。",
  },
  2: {
    en: "The oldest customary law of the Kei Islands, 'red blood and the spear from Bali', governing social harmony, respect for one another, and land rights. It remains the Kei people's compass to this day.",
    zh: "凯群岛最古老的习惯法，'红血与来自巴厘的矛'，规范社会和谐、彼此尊重与土地权利，至今仍是凯岛人的生活准则。",
  },
  3: {
    en: "An annual festival greeting the meti, the extreme low tide that unveils vast sand flats. Villagers fish together, hold food bazaars, and perform traditions upon the receded sea.",
    zh: "迎接meti（大退潮）的年度盛会，退去的海水露出广阔沙滩。村民一同捕鱼、摆设美食集市，并在滩涂上展演传统。",
  },
  4: {
    en: "The Kei customary village with its own traditional governance. Each ohoi holds communal land rights, a customary chief, and rules that live alongside the modern village administration.",
    zh: "凯岛的传统村落，拥有自己的习俗治理。每个ohoi都有共有土地权、部族首领，以及与现代村政并行的规约。",
  },
  5: {
    en: "The craft of weaving coconut fronds into mats, baskets, and roofing: everyday knowledge handed down from grandmother to grandchild in every coastal ohoi.",
    zh: "用椰叶编织草席、篮筐与屋顶的手艺，在每个海滨ohoi由祖辈代代相传的生活智慧。",
  },
};

export const spotDescTr: Record<number, ContentTr> = {
  1: {
    en: "Three kilometres of flour soft white sand, often called the finest in Asia. Gentle and safe for family swimming.",
    zh: "三公里细如面粉的白沙，常被誉为亚洲最细。坡缓浪柔，适合全家戏水。",
  },
  2: {
    en: "At meti the water retreats for hundreds of metres, unveiling a vast sand flat. The best spot to watch the sunset.",
    zh: "退潮时海水后退数百米，露出广阔沙滩，是观赏日落的最佳地点。",
  },
  3: {
    en: "A cave with a crystal clear brackish pool of blue green water. Swimming here feels like floating in a natural aquarium.",
    zh: "洞中有清澈见底的蓝绿色半咸水潭，在此游泳宛如置身天然水族馆。",
  },
  4: {
    en: "A two kilometre sandbar that appears at low tide, a stopover for pelicans. The surrounding reefs remain pristine.",
    zh: "退潮时浮现的两公里沙洲，是鹈鹕的驿站，周边珊瑚礁保存完好。",
  },
  5: {
    en: "White sand flanked by coral rock and lush coastal forest. Waves breaking on the rocks make it a favourite spot for a quiet sunset.",
    zh: "白沙滩两侧是珊瑚岩与茂密海岸林，浪花拍岸，是静赏落日的好去处。",
  },
  6: {
    en: "A hidden lagoon among karst cliffs, often dubbed a little Raja Ampat. Calm waters with superb snorkelling visibility.",
    zh: "藏于喀斯特峭壁间的隐秘泻湖，被称为小拉贾安帕特。水面平静，浮潜能见度极佳。",
  },
};

export const kategoriMakananTr: Record<string, ContentTr> = {
  makanan: { en: "Food", zh: "主食" },
  minuman: { en: "Drinks", zh: "饮品" },
  kudapan: { en: "Snacks", zh: "小吃" },
};

export const kategoriBudayaTr: Record<string, ContentTr> = {
  "Tradisi konservasi": { en: "Conservation tradition", zh: "保护传统" },
  "Hukum adat": { en: "Customary law", zh: "习惯法" },
  Festival: { en: "Festival", zh: "节庆" },
  "Tatanan adat": { en: "Customary order", zh: "传统制度" },
  Kerajinan: { en: "Craft", zh: "手工艺" },
};

export const jenisSpotTr: Record<string, ContentTr> = {
  Pantai: { en: "Beach", zh: "海滩" },
  Snorkeling: { en: "Snorkelling", zh: "浮潜" },
  Gua: { en: "Cave", zh: "洞穴" },
  Pulau: { en: "Island", zh: "岛屿" },
};

/** Glos bahasaIndonesia pada kamus (kolom sumber; kata Kei tetap). */
export const bahasaGlossTr: Record<number, ContentTr> = {
  1: { en: "Island", zh: "岛" },
  2: { en: "Sea", zh: "海" },
  3: { en: "Fish", zh: "鱼" },
  4: { en: "Chicken", zh: "鸡" },
  5: { en: "Egg", zh: "蛋" },
  6: { en: "Blood", zh: "血" },
  7: { en: "Red", zh: "红" },
  8: { en: "Spear", zh: "矛" },
  9: { en: "Low tide (meti)", zh: "退潮（meti）" },
  10: { en: "Village", zh: "村庄" },
  11: { en: "Kei Islands", zh: "凯群岛" },
  12: { en: "One for all, all for one", zh: "人人为我，我为人人" },
};

export const bahasaCatatanTr: Record<number, ContentTr> = {
  9: {
    en: "The extreme low tide celebrated in the Meti Kei Festival",
    zh: "Meti Kei节所庆祝的大退潮现象",
  },
  11: {
    en: "Evav is what the Kei people call their homeland",
    zh: "Evav是凯岛人对故土的称呼",
  },
  12: {
    en: "The brotherhood motto of the Kei people",
    zh: "凯岛人的团结格言",
  },
};
