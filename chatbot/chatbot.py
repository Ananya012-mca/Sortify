import json
from datetime import datetime
import random
import re
import os

# Optional RAG/LLM support
try:
    from .rag import RAGAssistant
except Exception:
    # allow direct import when running as a script
    try:
        from rag import RAGAssistant
    except Exception:
        RAGAssistant = None

class WasteclassificationChatbot:
    def __init__(self, use_rag: bool = False):
        self.waste_knowledge = {
            "cardboard": {
                "description": "Cardboard and corrugated boxes used for packaging and shipping",
                "recycling_tips": "Flatten boxes to save space. Remove any tape, staples, or non-cardboard materials. Keep dry to preserve recycling quality.",
                "what_to_do": "♻️ Place in recycling bin",
                "precautions": "Keep dry. Wet cardboard cannot be recycled. Remove all plastic, foam, or Styrofoam.",
                "reuse_ideas": "Use boxes for storage, moving, crafts, pet beds, composting, or garden mulch",
                "impact": "Recycling 1 ton of cardboard saves 46 gallons of oil and prevents 9 cubic yards of landfill space",
                "disposal_method": "Curbside pickup (most areas) or drop-off centers"
            },
            "glass": {
                "description": "Glass bottles, jars, and containers including beer bottles, jam jars, and beverage containers",
                "recycling_tips": "Rinse thoroughly. Remove caps and lids. Separate clear, brown, and green glass if required locally.",
                "what_to_do": "♻️ Place in glass recycling bin",
                "precautions": "Wrap broken glass in newspaper and label clearly. Glass doesn't mix well with other recyclables.",
                "reuse_ideas": "Clean jars for food storage, flower vases, candle holders, decorative items, or propagation stations",
                "impact": "Glass is 100% recyclable and can be recycled infinitely without quality loss. Saves 50% energy vs. new glass.",
                "disposal_method": "Glass collection or curbside pickup (check local guidelines for drop-off requirements)"
            },
            "metal": {
                "description": "Aluminum and steel cans, metal containers, food tins, and metal lids",
                "recycling_tips": "Rinse cans and containers. Flatten aluminum cans to save space. Remove any plastic or rubber parts.",
                "what_to_do": "♻️ Place in metal recycling bin",
                "precautions": "Empty all contents completely. Check for sharp edges on food cans.",
                "reuse_ideas": "Use for storage containers, planters for herbs, paint organizers, or craft supplies",
                "impact": "Recycling aluminum uses 95% less energy than producing new. A recycled can is back on shelf in 60 days.",
                "disposal_method": "Curbside pickup or take to recycling centers (aluminum often worth money at scrap yards)"
            },
            "paper": {
                "description": "Newspaper, magazines, office paper, cardboard, and paper packaging materials",
                "recycling_tips": "Keep paper dry and clean. Remove staples, paperclips, and other metal objects. Bundle securely.",
                "what_to_do": "♻️ Place in paper recycling bin",
                "precautions": "Do not recycle glossy, waxed, or laminated paper. Avoid wet paper and paper with food residue.",
                "reuse_ideas": "Use as wrapping paper, packing material, background for crafts, mulch for garden, or fire starter",
                "impact": "Recycling paper saves 60% energy and 70% water vs. making new paper. Prevents deforestation.",
                "disposal_method": "Curbside pickup or drop-off at recycling centers"
            },
            "plastic": {
                "description": "Plastic bottles, containers, bags, and packaging materials marked with recycling numbers 1-7",
                "recycling_tips": "Check the recycling number (1-7 in triangle). Rinse containers thoroughly. Remove caps if local rules allow.",
                "what_to_do": "♻️ Plastics 1-2 primary; check local guidelines for 3-7",
                "precautions": "Never put plastic bags in curbside bins - they jam machinery. Use proper plastic bag drop-off locations.",
                "reuse_ideas": "Reuse bottles for water, organize small items, use for plant propagation, craft projects, or pet toys",
                "impact": "Recycling plastic #1 & #2 is highest priority. Plastic takes 400-1000 years to decompose naturally.",
                "disposal_method": "Curbside pickup (usually types 1-2), plastic bag drop-offs, or special collection events"
            },
            "trash": {
                "description": "Non-recyclable waste including contaminated items, hazardous materials, and general refuse",
                "recycling_tips": "Dispose only items that cannot be recycled or composted. Separate recyclables before throwing away.",
                "what_to_do": "🗑️ Place in general trash bin",
                "precautions": "Some items need special disposal (electronics, batteries, oils, chemicals). Never dispose hazardous materials in regular trash.",
                "reuse_ideas": "Before throwing away, check if items can be donated, repurposed, or composted. Consider upcycling possibilities.",
                "impact": "Reducing trash reduces landfill overflow. Average person produces 4.5 lbs of waste daily.",
                "disposal_method": "Regular trash collection or hazmat facility depending on waste type"
            }
        }
        
        self.extended_faq = {
            "how to recycle": "Check your local waste type - cardboard, glass, metal, paper, plastic, or trash. Each has specific bin rules. Always rinse containers first!",
            "can i recycle wet paper": "❌ No way! Wet/damp paper contaminates the recycling stream and ruins entire batches. Keep paper DRY.",
            "what plastics can be recycled": "✅ Types #1 (PET bottles) & #2 (milk jugs, detergent) most common. #3-7 varies by location. Check your local rules!",
            "how to clean containers": "💧 Rinse with water. For sticky residue, use warm water or vinegar. Let dry completely. Don't waste water - use leftover water!",
            "what about plastic bags": "🚫 NEVER put in curbside bins - they jam sorting machinery! Use grocery store drop-off points instead.",
            "is styrofoam recyclable": "😞 Most curbside programs reject styrofoam/polystyrene. Check specialty drop-off centers or reuse for packing.",
            "how to dispose of broken glass": "🩹 Wrap securely in newspaper, label 'BROKEN GLASS', put in regular trash (NOT recycling). Protects workers!",
            "can i recycle food containers": "✔️ YES, but rinse thoroughly first! Food residue ruins entire batches at the facility.",
            "what about mixed materials": "⚠️ Separate by type! Foil+plastic combos can't be recycled. Some manufacturers accept multi-layer packaging.",
            "how to reduce waste": "Use the 4 Rs: Refuse unnecessary purchases → Reduce consumption → Reuse items → Recycle responsibly!",
            "what items can be donated": "👕 Clothes, 📚 books, 📦 furniture, 💻 electronics, 🧸 toys. Check local charities, thrift stores, free groups first.",
            "how often should i recycle": "♻️ ALWAYS! Make separating recyclables automatic - sort as you use items, not at the last minute.",
            "what about batteries": "🔋 ALL batteries → hazmat/e-waste facility. Rechargeable types especially critical. NEVER throw in trash!",
            "can i recycle pizza boxes": "🍕 If clean & dry, YES! But oily/greasy → compost or trash. Grease ruins paper recycling.",
            "what about aluminum foil": "🔌 Clean foil can recycle IF larger than golf ball & grease-free. Crumple into ball size first.",
            "how do i find recycling near me": "🔍 Search Earth911.com, ReCycleBank, or Google 'recycling <zipcode>' for nearby drop-off centers.",
            "what is single stream recycling": "📦 All recyclables in ONE bin - easier for you, but requires sophisticated sorting at facility.",
            "why should i recycle": "🌍 Saves energy/water, prevents landfill overflow, conserves resources, protects wildlife habitats!",
            "what happens after i recycle": "🔄 Sorted → cleaned → shredded → melted → reformed into new products. Aluminum back in stores in 60 days!",
            "is recycling actually helpful": "✅ ABSOLUTELY! Proper recycling dramatically reduces environmental impact vs. virgin material production.",
            "can i recycle compost": "🌿 Compost → special facilities only, NOT standard recycling. Some communities have separate collection.",
            "what is a recycling symbol": "♻️ Triangle with number 1-7 shows plastic type. #1&#2 easiest to recycle. Verify your local rules!",
            "can plastic be recycled forever": "⚠️ NO - quality degrades 4-6 cycles. Most becomes lower-grade products, eventually trash.",
            "what about takeout containers": "🥡 Clean & dry? Check #. Greasy/stained? Compost/trash. Styrofoam never standard pickup.",
            "how long does waste decompose": "⏱️ Plastic: 400-1000 yrs | Glass: 1 million yrs | Paper: 2-6 wks | Cardboard: 5 yrs | Metal: 200 yrs",
            "should i remove lids": "🔍 Check LOCAL rules - some programs handle lids fine, others ask you to remove. Most: remove = safer.",
            "can cardboard get wet": "💧 Small moisture okay, but very wet cardboard can't be processed. Keep relatively dry for best results.",
        }
        
        self.eco_facts = [
            "🔌 Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
            "🌍 Plastic bottles take 400-1000 years to decompose in a landfill.",
            "✨ Glass is 100% recyclable and can be recycled endlessly with zero quality loss.",
            "📄 Recycling paper saves 60% energy and 70% water vs. making new paper from trees.",
            "👤 The average person generates 4.5 pounds of trash every single day.",
            "📦 Recycling 1 ton of cardboard saves 46 gallons of oil and 9 cubic yards of landfill.",
            "💻 50+ million tons of e-waste are produced globally each year - recycle responsibly!",
            "⚡ Aluminum recycled cans are back on store shelves in as little as 60 days.",
            "💡 One recycled glass bottle powers a 100-watt light bulb for 4 hours.",
            "📊 About 80% of what we throw away could be recycled or composted.",
            "🌱 Recycling 1 ton of mixed paper saves 17 trees and 7,000 gallons of water.",
            "🥫 Producing new aluminum takes 20 times more energy than recycling aluminum.",
            "🌳 Paper takes 2-6 weeks to decompose, but recycling is 1000x faster.",
            "♻️ It takes 24 trees to make 1 ton of paper, but only 24 recycled cans for new aluminum.",
            "🌊 Recycling plastic prevents 92 million tons of waste from entering oceans yearly.",
            "⭐ Recycling steel creates 25% less air pollution and 76% less water pollution.",
            "🎁 Every ton of recycled plastic saves 5,774 kilowatt-hours of electricity.",
            "🏭 Recycling industries create 36 jobs per 1,000 tons processed vs 1 job in landfills.",
            "🌐 Globally, plastic in oceans will outweigh fish by 2050 if action isn't taken.",
            "🚀 Even small actions matter - 1 person saves ~1.5 tons/year of CO2 through recycling!",
            "🔋 Recycling 1 million laptops saves the energy equivalent to power 35,000 homes annually.",
            "🌲 Americans use about 50 pounds of paper per person per year - that's 8 billion trees!",
            "🎯 Recycling reduces landfill methane emissions, a potent greenhouse gas.",
            "💰 Aluminum recycling saves money - scrap yards pay per pound!",
            "🧵 Textile recycling can save 2,700 gallons of water per shirt.",
            "🌿 Composting food waste reduces methane from landfills by 25%.",
            "♻️ Buying recycled products closes the loop & ensures markets for recycled materials.",
            "🎪 One recycled plastic bottle saves enough oil to power a computer for 25 min.",
            "🏆 Japan recycles 50%+ of waste; USA recycles only ~35% - room to improve!",
            "🌎 If everyone in US recycled just 10% more, we'd save 1.6 million tons/year from landfills.",
        ]
        
        self.disposal_guides = {
            "box": "♻️ Clean cardboard → flatten & recycle. Greasy/wet → compost or trash.",
            "bottle": "♻️ Check #1-7. Rinse well. Remove cap (check local rules). Flat plastic/glass → recycle bin.",
            "can": "♻️ Aluminum/steel - rinse, flatten if aluminum. No dents or food residue needed.",
            "lid": "🔍 Check material. Metal → can bin. Plastic → type-dependent. Check local rules.",
            "bag": "🚫 NEVER curbside! Jams machinery. → Grocery store drop-off. Paper bag → compost/recycle.",
            "battery": "⚠️ ALL types → hazmat/e-waste facility ONLY. Toxic materials. Never regular trash!",
            "electronics": "♻️ Old phones, cables, monitors → e-waste facility or manufacturer take-back programs.",
            "light": "💡 LED/CFL → hazmat (mercury). Incandescent → trash or check if local recycles.",
            "food": "🥕 Compost if available, else special organics collection. NEVER in standard recycling.",
            "furniture": "♻️ Good condition → donate to furniture banks. Broken → bulk pickup/junk removal service.",
            "clothing": "👕 Clean → thrift stores, donation centers. Worn-out → textile recycling or rags.",
            "tire": "🛞 Auto shop, tire retailer, or special collection. Never trash. Some shops recycle free!",
            "paint": "🎨 Unopened → donate. Used → hazmat facility. Never pour down drain!",
            "oil": "🛢️ Used motor oil → recycling centers or auto shops. Never trash or drain.",
            "cork": "🍷 Clean cork → specialty recyclers or compost. Check local programs first.",
            "electronics heavy": "🖥️ CRT screens, lead glass → e-waste specialist. Standard recycling rejects these.",
            "glass broken": "🩹 Wrap in newspaper, label, → regular trash (NOT bin). Protects workers!",
            "mirror": "🪞 Not standard recycling. Donate if intact, or hazmat if broken.",
            "neon sign": "⚡ Contains mercury → hazmat facility. NEVER throw in trash. Special collection required.",
            "propane tank": "💨 DO NOT throw away! Auto repair, hardware store, hazmat → certified refill/disposal.",
            "fire extinguisher": "🔥 Hazmat facility only. Some stores/stations accept for refill/disposal.",
            "pesticide": "☠️ Hazmat facility ONLY. Highly toxic. Check product for local collection programs.",
            "needle": "💉 Medical sharps → sharps disposal container, then hazmat facility (not regular trash!).",
            "aerosol": "💨 Empty → recycle bin. Still pressurized → hazmat (never in trash).",
            "carpet": "🏠 Donation if quality. Otherwise bulk pickup/junk removal. Some installers haul old.",
            "drywall": "🏗️ Construction waste → special facility. Check local construction debris programs.",
            "insulation": "🧪 Fiberglass/asbestos → hazmat. Modern eco insulation → check facility acceptance.",
            "rubber": "🛞 Shoe soles → specialty/reuse. Tires separate. Most rubber → hazmat not standard.",
            "foam": "🫧 Polystyrene/styrofoam → specialty centers only. Most sites reject this type.",
            "vinyl": "🎛️ PVC/vinyl → specialty recyclers (industrial). Not standard pickup. Check local.",
            "fabric": "🧵 Natural fibers → compost. Synthetics → textile recycling or donation.",
            "leather": "👜 Good condition → donation. Worn → compost (natural leather only).",
            "suede": "👞 Similar to leather - donate quality, compost worn natural suede.",
            "fur": "🐾 Donate to charities if authentic. Synthetic → textile recycling. Local rules vary.",
        }
        
        self.tips_by_context = {
            "home": [
                "Set up a recycling station with bins for each material type",
                "Keep a container for compostable items near your kitchen",
                "Rinse containers immediately after use while damp",
                "Flatten boxes and cans to maximize bin space",
                "Learn your local recycling rules and post them near bins"
            ],
            "office": [
                "Use double-sided copying to reduce paper waste",
                "Set up a paper recycling station separate from trash",
                "Use reusable mugs and containers for lunch",
                "Recycle toner cartridges through manufacturer programs",
                "Use digital documents instead of printing when possible"
            ],
            "restaurant": [
                "Compost food scraps and organic waste",
                "Separate recyclables from trash immediately",
                "Use reusable containers for takeout when possible",
                "Recycle cardboard boxes from deliveries",
                "Train staff on proper recycling procedures"
            ],
            "travel": [
                "Bring reusable water bottle and fill at water fountains",
                "Separate recyclables if bins available",
                "Choose accommodations with recycling programs",
                "Minimize single-use packaging",
                "Participate in local recycling initiatives"
            ]
        }
        
        self.impact_stats = {
            "plastic": "⏱️ Decomposes in 400-1000 years | 🔋 Recycling saves 5,774 kWh per ton | 🌊 Prevents ocean pollution | ♻️ Can be recycled 4-6 times",
            "glass": "⏱️ Takes 1 million years to decompose | ✨ 100% infinitely recyclable | ⚡ Saves 50% energy vs. new glass | 💎 Quality never degrades",
            "aluminum": "⏱️ Decomposes in 200+ years | ⚡ Recycling saves 95% energy | 🚀 Back on shelf in 60 days | 💰 Worth money at scrap yards",
            "paper": "⏱️ Decomposes in 2-6 weeks | 💧 Recycling saves 70% water | 🌲 Saves 17 trees per ton | ⚡ Uses 60% less energy",
            "cardboard": "⏱️ Decomposes in ~5 years | 🛢️ Saves 46 gallons oil per ton | 📏 Saves 9 cubic yards landfill | 🌍 Readily recyclable",
            "general": "☠️ Average person: 4.5 lbs/day waste | 📊 80% could be recycled/composted | 🌍 Landfills release methane | 💡 Every action counts!",
            "metal": "⏱️ Steel: 50-200 yrs | 🏭 Creates 25% less air pollution | 🌊 76% less water pollution | ♻️ Infinitely recyclable",
            "compost": "⏱️ Organic waste breaks down in months | 🌿 Returns nutrients to soil | 💨 Reduces landfill methane 25% | 🌱 Supports plants",
        }

        self.unrelated_topics = [
            "boxing", "wrestling", "mma", "sports", "football", "basketball", "baseball", "soccer", "hockey",
            "movie", "film", "music", "song", "artist", "singer", "actor",
            "politics", "government", "election", "president", "politician",
            "weather", "rain", "snow", "temperature",
            "joke", "funny", "humor", "laugh", "comedy",
            "horror", "scary", "scare", "frighten",
            "recipe", "cooking", "food", "meal", "dish",
            "gaming", "game", "video game", "play", "fortnite", "minecraft", "roblox",
            "stocks", "crypto", "bitcoin", "ethereum", "investment", "trading",
            "relationships", "dating", "love", "romance", "partner",
            "medical", "doctor", "disease", "sick", "health", "hospital", "cure",
            "math", "algebra", "calculus", "physics", "chemistry",
            "history", "ancient", "war", "medieval", "revolution",
            "technology", "computer", "software", "hardware", "coding",
            "art", "painting", "sculpture", "drawing",
            "cars", "vehicle", "automobile", "truck", "bike",
            "animals", "pets", "dog", "cat", "bird", "fish",
            "books", "novel", "author", "story", "fiction",
            "school", "university", "education", "student", "teacher",
            "fashion", "clothing", "dress", "style",
            "religion", "god", "spiritual", "church"
        ]
        # RAG assistant (optional)
        self.use_rag = use_rag or os.environ.get("USE_RAG", "0") == "1"
        self.rag = None
        if self.use_rag and RAGAssistant is not None:
            try:
                self.rag = RAGAssistant()
                # Build index from available knowledge
                self._build_rag_index()
            except Exception:
                self.rag = None

    def _find_waste_type(self, message):
        """Find waste type keywords in message"""
        message_lower = message.lower()
        for waste_type in self.waste_knowledge:
            if waste_type in message_lower:
                return waste_type
        return None

    def _is_unrelated(self, message):
        """Check if message is about unrelated topics"""
        message_lower = message.lower()
        for topic in self.unrelated_topics:
            if topic in message_lower:
                return True
        return False

    def get_waste_info(self, waste_type):
        """Get detailed information about a waste type"""
        waste_type = waste_type.lower().strip()
        if waste_type in self.waste_knowledge:
            return self.waste_knowledge[waste_type]
        return None

    def get_disposal_guide(self, item):
        """Get disposal guidance for specific items"""
        item_lower = item.lower().strip()
        if item_lower in self.disposal_guides:
            return self.disposal_guides[item_lower]
        return None

    def get_tips_by_context(self, context):
        """Get recycling tips for specific context"""
        context_lower = context.lower().strip()
        if context_lower in self.tips_by_context:
            return self.tips_by_context[context_lower]
        return None

    def answer_faq(self, question):
        """Answer frequently asked questions with fuzzy matching"""
        question_lower = question.lower().strip()
        for key, answer in self.extended_faq.items():
            if key in question_lower or self._similarity(key, question_lower) > 0.6:
                return answer
        return None

    def _similarity(self, a, b):
        """Enhanced string similarity check using multiple metrics"""
        a_words = set(a.split())
        b_words = set(b.split())
        
        # Jaccard similarity (word overlap)
        if len(a_words | b_words) == 0:
            return 0
        
        intersection = len(a_words & b_words)
        union = len(a_words | b_words)
        jaccard = intersection / union
        
        # Character-level overlap
        common_chars = sum(1 for c in a if c in b)
        char_similarity = common_chars / max(len(a), len(b)) if max(len(a), len(b)) > 0 else 0
        
        # Weighted combination (favor word matches more)
        return (jaccard * 0.7) + (char_similarity * 0.3)

    def get_recycling_tips(self, waste_type):
        """Get recycling tips for a specific waste type"""
        waste_type = waste_type.lower().strip()
        if waste_type in self.waste_knowledge:
            return self.waste_knowledge[waste_type]["recycling_tips"]
        return None

    def get_reuse_ideas(self, waste_type):
        """Get creative reuse ideas"""
        waste_type = waste_type.lower().strip()
        if waste_type in self.waste_knowledge:
            return self.waste_knowledge[waste_type]["reuse_ideas"]
        return None

    def get_all_categories(self):
        """Get list of all waste categories"""
        return list(self.waste_knowledge.keys())

    def _build_rag_index(self):
        """Build a retrieval index from internal knowledge for RAG assistant."""
        if self.rag is None:
            return

        sources = []
        # Add waste categories
        for cat, info in self.waste_knowledge.items():
            title = f"Category: {cat.title()}"
            text = "\n".join([f"{k}: {v}" for k, v in info.items() if isinstance(v, str)])
            sources.append((title, text))

        # Add FAQs
        for q, a in self.extended_faq.items():
            sources.append((f"FAQ: {q}", a))

        # Add disposal guides
        for item, guide in self.disposal_guides.items():
            sources.append((f"Guide: {item}", guide))

        self.rag.build_index(sources)

    def get_random_fact(self):
        """Get a random eco-friendly fact"""
        return random.choice(self.eco_facts)

    def get_impact_info(self, waste_type):
        """Get environmental impact info"""
        waste_type = waste_type.lower().strip()
        if waste_type in self.impact_stats:
            return self.impact_stats[waste_type]
        return None

    def chat(self, user_message):
        """Main chatbot response function with enhanced intent detection"""
        original_message = user_message
        user_message_lower = user_message.lower().strip()

        # Greeting detection: reply with brief greeting and prompt
        greeting_patterns = [r"^hi\b", r"^hello\b", r"^hey\b", r"^good (morning|afternoon|evening)", r"^hiya\b", r"^yo\b"]
        for pat in greeting_patterns:
            if re.search(pat, user_message_lower):
                return {
                    "type": "greeting",
                    "response": "Hi! 👋 I'm Sortify's Waste Assistant — ask me about recycling, disposal, or environmental impact. What would you like to know?"
                }

        # Check for unrelated topics (but allow queries that ask about context even if they contain context words)
        context_keywords = ["home", "office", "restaurant", "travel"]
        is_context_query = any(ctx in user_message_lower for ctx in context_keywords) and any(
            w in user_message_lower for w in ["tip", "how", "recycle", "waste", "manage"]
        )
        
        if self._is_unrelated(user_message_lower) and not is_context_query:
            responses = [
                "🎯 I specialize in waste classification and recycling! Ask me about recyclables, disposal methods, or environmental impact. What can I help with?",
                "📚 That's interesting, but I'm focused on waste management & recycling. What would you like to know about sorting your trash? ♻️",
                "🌍 I'm your waste & recycling expert! Got questions about disposing, recycling, or composting something specific?",
                "💡 Let's keep focused on sustainability! Ask me anything about waste types, eco-facts, or disposal guidance."
            ]
            return {"type": "unrelated", "response": random.choice(responses)}

        # Help request patterns (CHECK EARLY to avoid false positives like "can you help")
        if any(w in user_message_lower for w in ["help", "how do", "what should", "guide", "teach", "learn", "confused", "uncertain"]):
            return {
                "type": "help",
                "response": "🤝 **I can help with:**\n📦 **Waste Categories**: cardboard, glass, metal, paper, plastic, trash\n💡 **Recycling Tips**: preparation, sorting, best practices\n🌍 **Impact Info**: decomposition times, environmental benefits\n📍 **Item Disposal**: batteries, electronics, paint, tires, etc.\n🏠 **Context Tips**: home, office, restaurant, travel recycling\n📚 **FAQs**: common questions about recycling rules\n\nWhat's your question?"
            }

        # Emergency/urgent disposal items first
        urgent_items = ["battery", "electronics", "paint", "oil", "propane", "fire extinguisher", "pesticide", "hazardous"]
        for item in urgent_items:
            if item in user_message_lower:
                guide = self.disposal_guides.get(item)
                if guide:
                    return {"type": "disposal", "item": item, "priority": "urgent", "response": f"⚠️ {guide}"}

        # Context-based tips (HOME, OFFICE, RESTAURANT, TRAVEL) - CHECK EARLY
        for context, tips in self.tips_by_context.items():
            pattern = r'\b' + re.escape(context) + r'\b'
            if re.search(pattern, user_message_lower):
                tips_text = "\n".join([f"• {tip}" for tip in tips])
                return {
                    "type": "tips_context",
                    "context": context,
                    "response": f"💡 **Tips for {context.title()}:**\n{tips_text}"
                }

        # Fact requests
        fact_keywords = ["fact", "did you know", "tell me", "fun fact", "interesting", "statistics", "how much", "how long", "decompose", "years"]
        if any(w in user_message_lower for w in fact_keywords):
            return {"type": "fact", "response": self.get_random_fact()}

        # Waste type queries with detailed response (BEFORE item disposal)
        waste_type = self._find_waste_type(user_message_lower)
        if waste_type:
            if any(w in user_message_lower for w in ["impact", "environment", "co2", "save", "benefit", "effect", "decompose", "years"]):
                impact = self.get_impact_info(waste_type)
                return {"type": "impact", "waste_category": waste_type, "response": f"🌍 **Environmental Impact ({waste_type.title()}):** {impact}"}
            elif any(w in user_message_lower for w in ["tip", "how to", "prepare", "process", "ready", "before", "separate"]):
                tips = self.get_recycling_tips(waste_type)
                return {"type": "tips", "waste_category": waste_type, "response": f"💡 **Recycling Tips ({waste_type.title()}):**\n{tips}"}
            elif any(w in user_message_lower for w in ["reuse", "creative", "idea", "repurpose", "use again", "second life"]):
                ideas = self.get_reuse_ideas(waste_type)
                return {"type": "reuse", "waste_category": waste_type, "response": f"♻️ **Reuse Ideas ({waste_type.title()}):**\n{ideas}"}
            else:
                info = self.get_waste_info(waste_type)
                if info:
                    summary = f"**{waste_type.title()}**: {info['description']}\n\n🔄 **What to do**: {info['what_to_do']}\n💡 **Tips**: {info['recycling_tips']}\n⚠️ **Important**: {info['precautions']}\n🌍 **Impact**: {info['impact']}"
                    return {"type": "info", "waste_category": waste_type, "data": info, "response": summary}

        # Direct item disposal (for common items, with word boundary checking)
        # Skip if the query is clearly about waste reduction/minimization (not item disposal)
        reduction_keywords = ["reduce", "minimize", "less", "fewer", "decrease", "cut down"]
        is_about_reduction = any(w in user_message_lower for w in reduction_keywords)
        
        if not is_about_reduction:
            # Check longer items first to avoid partial matches
            sorted_items = sorted(self.disposal_guides.items(), key=lambda x: len(x[0]), reverse=True)
            for item, guide in sorted_items:
                # Use word boundaries to avoid matching "can" in general context questions
                # But do match if it's clearly about that specific item
                pattern = r'\b' + re.escape(item) + r'( |s|es|ed|ing)?\b'
                if re.search(pattern, user_message_lower):
                    # For "can", only match if it's in context of disposal/action questions  
                    if item == "can":
                        # Include "what/how should I do", "throw away", etc.
                        disposal_intent = ["throw", "discard", "dispose", "get rid", "remove", "dump", "do with", "should"]
                        if any(k in user_message_lower for k in disposal_intent):
                            return {"type": "disposal", "item": item, "response": guide}
                    else:
                        return {"type": "disposal", "item": item, "response": guide}

        # FAQ matching with better scoring
        best_match = None
        best_score = 0.55
        for key, answer in self.extended_faq.items():
            # Exact phrase match
            if key in user_message_lower:
                return {"type": "faq", "response": answer}
            # Score based on keyword overlap
            score = self._similarity(key, user_message_lower)
            if score > best_score:
                best_score = score
                best_match = answer

        if best_match:
            return {"type": "faq", "response": best_match}

        # Categories/types request
        if any(w in user_message_lower for w in ["categories", "types", "what can", "list", "all types", "available"]):
            categories = ", ".join([f"♻️ {c.title()}" for c in self.get_all_categories()])
            return {"type": "categories", "response": f"I can help you with these waste types:\n{categories}\n\nWhat would you like to know?"}

        # Affirmation/continuation
        if any(w in user_message_lower for w in ["thanks", "thank you", "helpful", "ok", "got it", "sure", "yes"]):
            return {
                "type": "affirmation",
                "response": "😊 Happy to help! Got more questions about waste or recycling? Just ask!"
            }

        # Friendly fallback with RAG support (if enabled)
        if self.use_rag and self.rag is not None:
            try:
                rag_resp = self.rag.answer(original_message, top_k=3)
                if rag_resp.get("used_llm"):
                    return {"type": "rag", "response": rag_resp["answer"], "sources": rag_resp.get("retrieved", [])}
                else:
                    # Return retrieved passages as a helpful summary
                    return {"type": "rag_fallback", "response": rag_resp["answer"], "sources": rag_resp.get("retrieved", [])}
            except Exception:
                pass

        # Friendly fallback with suggestions
        responses = [
            "🤔 I'm not quite sure about that! Try asking:\n• About a waste type (cardboard, glass, metal, paper, plastic, trash)\n• How to dispose of something (e.g., 'batteries', 'paint')\n• Environmental impact facts\n• Tips for a location (home, office, restaurant, travel)",
            "💭 Could you rephrase? I specialize in:\n• Recycling & waste classification\n• Disposal guidelines\n• Environmental impact\n• Reuse & donation ideas\nWhat would you like to know?",
            "📝 I'd love to help! Ask about:\n• Specific waste items or categories\n• How to recycle properly\n• Environmental statistics\n• Tips for reducing waste\nWhat's on your mind?"
        ]
        return {"type": "help", "response": random.choice(responses)}
