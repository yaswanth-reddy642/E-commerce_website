import random
from typing import List, Dict, Any
from app.schemas.api_schemas import (
    AICropRecommendResponse, RecommendedCropItem,
    AIDiseaseDiagnoseResponse, AIPendingPriceForecast,
    AIChatResponse
)

class AIService:
    @staticmethod
    def recommend_crops(
        location: str,
        soil_type: str,
        nitrogen: float,
        phosphorous: float,
        potassium: float,
        ph_level: float,
        rainfall: float,
        temperature: float
    ) -> AICropRecommendResponse:
        # Determine recommendations based on parameters
        recommended = []
        
        # Black soil / Medium-High NPK -> Cotton, Soybeans, Wheat
        if soil_type.lower() in ["black", "clayey"] and rainfall < 1200:
            recommended.append(RecommendedCropItem(
                crop_name="Bt Cotton",
                confidence=0.92,
                estimated_yield="2.2 - 2.8 Tons/Hectare",
                suitable_seasons=["Kharif (June - October)"],
                market_demand="High",
                reasoning=f"Black clayey soil in {location} has excellent moisture retention suitable for Cotton. Current temperature ({temperature}°C) is in the optimal 21-30°C range."
            ))
            recommended.append(RecommendedCropItem(
                crop_name="Soybean (JS 335)",
                confidence=0.85,
                estimated_yield="1.8 - 2.3 Tons/Hectare",
                suitable_seasons=["Kharif (June - September)"],
                market_demand="Medium",
                reasoning="Moderate rainfall and neutral-to-slightly alkaline pH levels support healthy nitrogen-fixation in soybean nodes."
            ))
        # Alluvial soil / High NPK / High Rainfall -> Rice/Paddy, Sugarcane
        elif soil_type.lower() in ["alluvial", "clayey"] or rainfall >= 1200:
            recommended.append(RecommendedCropItem(
                crop_name="Paddy (Swarna Rice)",
                confidence=0.95,
                estimated_yield="4.5 - 5.5 Tons/Hectare",
                suitable_seasons=["Kharif (June - Nov)", "Rabi (Nov - April)"],
                market_demand="High",
                reasoning=f"High rainfall ({rainfall}mm) combined with clayey alluvial soil provides perfect waterlogging conditions required for paddy nursery and transplantation."
            ))
            recommended.append(RecommendedCropItem(
                crop_name="Sugarcane (Co 86032)",
                confidence=0.88,
                estimated_yield="75 - 90 Tons/Hectare",
                suitable_seasons=["Year-Round (Jan - Dec)"],
                market_demand="High",
                reasoning="Requires prolonged warm weather and ample soil nutrients. Your NPK levels are highly supportive of vegetative cane elongation."
            ))
        # Sandy / Laterite soil / Low Rainfall / Moderate NPK -> Groundnut, Chili, Maize
        else:
            recommended.append(RecommendedCropItem(
                crop_name="Groundnut (Kadiri-6)",
                confidence=0.89,
                estimated_yield="2.0 - 2.5 Tons/Hectare",
                suitable_seasons=["Kharif", "Rabi"],
                market_demand="Medium",
                reasoning="Sandy/loamy texture ensures well-drained conditions. Groundnut pods require loose soil for easy penetration and development."
            ))
            recommended.append(RecommendedCropItem(
                crop_name="Guntur Red Chili",
                confidence=0.86,
                estimated_yield="1.5 - 2.0 Tons/Hectare",
                suitable_seasons=["Rabi (September - February)"],
                market_demand="High",
                reasoning=f"Mild winter temperature of {temperature}°C and well-aerated sandy-loam soil promotes capsicum growth and prevents root rot."
            ))
            recommended.append(RecommendedCropItem(
                crop_name="Maize (Dharampuri Hybrid)",
                confidence=0.81,
                estimated_yield="4.0 - 5.0 Tons/Hectare",
                suitable_seasons=["Kharif", "Rabi"],
                market_demand="High",
                reasoning="Highly adaptable crop, needs good drainage. Soil pH of {ph_level} is within the ideal 5.8-7.5 range."
            ))

        # Default fallback if nothing matches
        if not recommended:
            recommended.append(RecommendedCropItem(
                crop_name="Maize",
                confidence=0.75,
                estimated_yield="3.8 Tons/Hectare",
                suitable_seasons=["Kharif", "Rabi"],
                market_demand="High",
                reasoning="Generic adaptation for local temperature and pH profile."
            ))

        # Soil analysis report
        npk_sum = nitrogen + phosphorous + potassium
        if npk_sum < 120:
            soil_status = "Nutrient deficient. Nitrogen, phosphorous, or potassium levels are lower than optimal."
            tips = [
                "Apply organic farmyard manure (FYM) at 10 tons/hectare.",
                "Incorporate nitrogen-fixing cover crops (like Sunn hemp) before main crop sowings.",
                "Consider micro-nutrient spraying if leaf yellowing is observed."
            ]
        else:
            soil_status = "Optimal nutrient profile. The soil contains sufficient macro-nutrients for high-yield farming."
            tips = [
                "Practice crop rotation to maintain this balanced nutrient level.",
                "Conduct soil test every 2 years to monitor micro-nutrient depletion.",
                "Ensure controlled irrigation to prevent leaching of active nitrates."
            ]

        if ph_level < 6.0:
            soil_status += " Acidic pH detected."
            tips.append("Apply agricultural lime (calcium carbonate) to neutralize soil acidity.")
        elif ph_level > 7.5:
            soil_status += " Alkaline pH detected."
            tips.append("Apply gypsum (calcium sulfate) or organic mulch to reduce alkalinity.")

        return AICropRecommendResponse(
            recommended_crops=recommended,
            soil_analysis=soil_status,
            general_tips=tips
        )

    @staticmethod
    def diagnose_disease(filename: str) -> AIDiseaseDiagnoseResponse:
        fn_lower = filename.lower()
        
        # Simulating disease diagnostics by parsing keywords in the file name
        if "tomato" in fn_lower or "blight" in fn_lower:
            return AIDiseaseDiagnoseResponse(
                disease_name="Tomato Late Blight (Phytophthora infestans)",
                confidence=0.94,
                treatment_suggestions=[
                    "Spray Mancozeb or Copper Oxychloride fungicides (2g/L of water) immediately.",
                    "Remove and safely burn heavily infected lower foliage.",
                    "Avoid overhead sprinkler irrigation to keep leaf surfaces dry."
                ],
                preventative_measures=[
                    "Choose blight-resistant seed varieties (like Arka Rakshak).",
                    "Maintain proper plant spacing (60x45 cm) for excellent air circulation.",
                    "Apply mulching sheet to block soil-borne spore splashback."
                ],
                severity="High"
            )
        elif "cotton" in fn_lower or "leaf" in fn_lower:
            return AIDiseaseDiagnoseResponse(
                disease_name="Cotton Leaf Curl Disease (CLCuD)",
                confidence=0.88,
                treatment_suggestions=[
                    "Control the Whitefly vector by spraying Neem oil (1500 ppm) or Acetamiprid insecticide.",
                    "Uproot and destroy infected volunteer cotton weeds.",
                    "Apply foliar spray of potassium nitrate to boost crop immunity."
                ],
                preventative_measures=[
                    "Plant CLCuD-resistant Bt hybrids certified by ICAR.",
                    "Install yellow sticky traps (15 per acre) to monitor vector insect populations.",
                    "Avoid excessive nitrogenous fertilizer application which attracts whiteflies."
                ],
                severity="Medium"
            )
        elif "rice" in fn_lower or "blast" in fn_lower or "paddy" in fn_lower:
            return AIDiseaseDiagnoseResponse(
                disease_name="Rice Blast (Magnaporthe oryzae)",
                confidence=0.91,
                treatment_suggestions=[
                    "Foliar spray of Tricyclazole 75 WP at 0.6g/L or Isoprothiolane at 1.5ml/L of water.",
                    "Avoid applying top-dress nitrogen fertilizer until the disease is arrested.",
                    "Maintain thin standing water film in the field to restrict spore maturation."
                ],
                preventative_measures=[
                    "Treat seeds with Carbendazim (2g/kg seed) before sowing.",
                    "Follow moderate nitrogen scheduling (split doses instead of single dumps).",
                    "Burn stubbles and weed hosts after harvest to prevent spore overwintering."
                ],
                severity="High"
            )
        elif "chili" in fn_lower or "anthracnose" in fn_lower or "fruit" in fn_lower:
            return AIDiseaseDiagnoseResponse(
                disease_name="Chili Anthracnose / Fruit Rot (Colletotrichum capsici)",
                confidence=0.87,
                treatment_suggestions=[
                    "Spray Azoxystrobin (1ml/L) or Carbendazim (1g/L) at the initiation of flowering.",
                    "Collect and destroy affected chili pods from the field.",
                    "Spray micro-nutrients to reduce stress-induced fruit drop."
                ],
                preventative_measures=[
                    "Sow pathogen-free healthy seeds sourced from government depots.",
                    "Implement a 3-year crop rotation omitting solanaceous crops (potato, brinjal).",
                    "Deep summer plowing to expose fungal sclerotia to solar heat."
                ],
                severity="Medium"
            )
        else:
            # Healthy crop or fallback
            return AIDiseaseDiagnoseResponse(
                disease_name="No Disease Detected (Healthy Crop)",
                confidence=0.96,
                treatment_suggestions=[
                    "No fungicide treatment required.",
                    "Continue scheduled organic liquid manure (Jeevamrutha) applications."
                ],
                preventative_measures=[
                    "Keep up weekly checks on the underside of leaves for early insect egg deposits.",
                    "Maintain standard drip irrigation frequency."
                ],
                severity="Low"
            )

    @staticmethod
    def forecast_price(crop_name: str) -> AIPendingPriceForecast:
        crop_name_clean = crop_name.strip().title()
        
        # Seed prices base
        prices = {
            "Paddy": 23.0,
            "Wheat": 24.5,
            "Bt Cotton": 75.0,
            "Guntur Red Chili": 180.0,
            "Groundnut": 65.0,
            "Maize": 21.0,
            "Sugarcane": 3.2, # per kg (3200 per ton)
            "Tomato": 18.0,
            "Onion": 25.0
        }
        
        base_price = prices.get(crop_name_clean, 30.0)
        
        # Forecast months (July to Dec 2026)
        months = ["July", "August", "September", "October", "November", "December"]
        forecast_list = []
        
        trend = random.choice(["up", "down", "stable"])
        current_price = base_price
        
        for i, m in enumerate(months):
            # Seasonality logic (e.g. crop harvest dip)
            seasonality = 1.0
            if m in ["October", "November"] and crop_name_clean in ["Paddy", "Cotton"]:
                # Harvest dip
                seasonality = 0.90
            elif m in ["July", "August"] and crop_name_clean == "Tomato":
                # Monsoon supply gap spike
                seasonality = 1.35
            
            if trend == "up":
                current_price += random.uniform(0.02, 0.06) * base_price
            elif trend == "down":
                current_price -= random.uniform(0.01, 0.04) * base_price
            else:
                current_price += random.uniform(-0.02, 0.02) * base_price
                
            final_p = round(current_price * seasonality, 2)
            forecast_list.append({"month": m, "price": max(final_p, 5.0)})

        # Calculations
        demand_index = round(random.uniform(6.5, 9.2), 1)
        profit_margin = round(random.uniform(22.0, 48.0), 1)
        
        recom = f"Prices for {crop_name_clean} are expected to remain strong due to festive demand in Q4. It is recommended to store dry stock and sell post-October harvest to capture maximum profitability."
        if trend == "down":
            recom = f"Forcasted supply surplus indicates a slight dip in {crop_name_clean} rates. Farmers are advised to secure forward-contract pricing or sell immediately post-harvest to avoid losses."
            
        return AIPendingPriceForecast(
            crop_name=crop_name_clean,
            forecast=forecast_list,
            demand_index=demand_index,
            profit_margin_pct=profit_margin,
            recommendation=recom
        )

    @staticmethod
    def chat_adviser(message: str, language: str = "en") -> AIChatResponse:
        msg = message.lower()
        
        # Expert advice database based on keywords
        responses_en = {
            "default": "KrishiConnect AI Advisor: I am here to help you. Ask me about government subsidies (PM-KISAN), organic farming recipes, pest controls, or sowing timelines.",
            "hello": "Hello! I am your KrishiConnect AI farming advisor. How can I help you improve your crop yields today?",
            "paddy": "For Paddy (Rice), nursery sowing should start with monsoon arrival in June. Use 3-split fertilizer dosing: 50% nitrogen at transplanting, 25% at active tillering, and 25% at panicle initiation.",
            "tomato": "To secure high tomato yields: maintain stake support for plants to keep fruit off the soil, use drip lines to restrict root-rot pathogens, and spray neem oil to manage leaf-miners.",
            "pest": "For organic pest management: Spray Neemark (Neem oil) at 1500ppm. Alternatively, spray 'Agniastra' (decoction of cow urine, neem leaves, garlic, and green chili) to combat whitefly, aphid, and borer pests.",
            "fertilizer": "NPK ratio recommendation: Grains usually prefer 4:2:1 (N:P:K), Pulses need 1:2:2 (low N due to root nodule nitrogen fixation), and Oilseeds need 3:2:2. Always check soil health card reports first.",
            "subsidy": "Government Schemes: \n1. PM-KISAN: ₹6,000/year direct cash transfer.\n2. PM Fasal Bima Yojana: Low-cost crop insurance protecting against weather disasters.\n3. Soil Health Card Scheme: Free soil testing provided every 2 years.",
            "scheme": "Government Schemes: \n1. PM-KISAN: ₹6,000/year direct cash transfer.\n2. PM Fasal Bima Yojana: Low-cost crop insurance protecting against weather disasters.\n3. Soil Health Card Scheme: Free soil testing provided every 2 years.",
            "weather": "Monsoon rains are key. Maintain field drainage channels to prevent water logging in cotton and pulses, and capture run-off water in farm ponds for dry-spell irrigation.",
            "price": "Market Price Tip: Use our AI price forecaster tab to view seasonal pricing graphs. Pulse and Guntur Chili prices are expected to rally, while early tomato crops face price volatility."
        }

        responses_te = {
            "default": "కృషి కనెక్ట్ AI సలహాదారు: రైతులకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. పిఎం-కిసాన్ సబ్సిడీలు, సేంద్రీయ వ్యవసాయం, తెగుళ్ల నివారణ గురించి అడగండి.",
            "hello": "నమస్కారం! నేను మీ కృషి కనెక్ట్ AI వ్యవసాయ సలహాదారుని. మీ పంట దిగుబడిని ఎలా పెంచుకోవాలో అడగండి?",
            "paddy": "వరి పంటకు జూన్ నాట్లు అనుకూలం. మూడు సార్లు ఎరువులు వేయాలి: నాటు వేసేటప్పుడు 50% నత్రజని, పిలకలు తొడిగే దశలో 25%, చిరుపొట్ట దశలో 25%.",
            "pest": "సేంద్రీయ తెగుళ్ల నివారణకు 1500ppm వేప నూనెను పిచికారీ చేయండి. లేదా ఆవు మూత్రం, వేపాకులు, వెల్లుల్లి, పచ్చిమిర్చి కలిపి తయారు చేసిన 'అగ్నిఅస్త్రం' వాడండి.",
            "subsidy": "ప్రభుత్వ పథకాలు: \n1. పీఎం కిసాన్: సంవత్సరానికి ₹6,000 నగదు బదిలీ.\n2. పీఎం ఫసల్ బీమా యోజన: పంట నష్టానికి బీమా పథకం.\n3. సాయిల్ హెల్త్ కార్డ్: ఉచిత భూసార పరీక్షలు.",
            "scheme": "ప్రభుత్వ పథకాలు: \n1. పీఎం కిసాన్: సంవత్సరానికి ₹6,000 నగదు బదిలీ.\n2. పీఎం ఫసల్ బీమా యోజన: పంట నష్టానికి బీమా పథకం.\n3. సాయిల్ హెల్త్ కార్డ్: ఉచిత భూసార పరీక్షలు."
        }

        responses_hi = {
            "default": "कृषि कनेक्ट एआई सलाहकार: मैं आपकी सहायता के लिए तैयार हूँ। आप मुझसे सरकारी योजनाओं (PM-KISAN), जैविक खेती, कीटनाशक या बुवाई के बारे में पूछ सकते हैं।",
            "hello": "नमस्कार! मैं आपका कृषि कनेक्ट एआई सलाहकार हूँ। आज मैं आपकी फसल की उपज बढ़ाने में कैसे सहायता कर सकता हूँ?",
            "paddy": "धान के लिए जून में नर्सरी तैयार करें। उर्वरक तीन बार में दें: रोपाई के समय 50% नाइट्रोजन, कल्ले निकलते समय 25%, और बालियां बनते समय 25%।",
            "pest": "जैविक कीट नियंत्रण के लिए 1500ppm नीम के तेल का छिड़काव करें या गोमूत्र, नीम पत्ती, लहसुन और मिर्च से बनी 'अग्निअस्त्र' का प्रयोग करें।",
            "subsidy": "सरकारी योजनाएं: \n1. पीएम-किसान: ₹6,000 वार्षिक नकद सहायता।\n2. पीएम फसल बीमा योजना: कम प्रीमियम पर फसल नुकसान बीमा।\n3. मृदा स्वास्थ्य कार्ड योजना: मिट्टी की जांच निशुल्क उपलब्ध।",
            "scheme": "सरकारी योजनाएं: \n1. पीएम-किसान: ₹6,000 वार्षिक नकद सहायता।\n2. पीएम फसल बीमा योजना: कम प्रीमियम पर फसल नुकसान बीमा।\n3. मृदा स्वास्थ्य कार्ड योजना: मिट्टी की जांच निशुल्क उपलब्ध।"
        }

        # Select responses dictionary
        active_db = responses_en
        if language == "te":
            active_db = responses_te
        elif language == "hi":
            active_db = responses_hi
            
        # Match keywords
        matched_key = "default"
        for key in active_db.keys():
            if key != "default" and key in msg:
                matched_key = key
                break
                
        # Recommendations / suggestions to return
        suggestions_en = ["Tell me about PM-KISAN scheme", "How to manage tomato pests?", "NPK fertilizer ratio", "Organic pest spray recipe"]
        suggestions_te = ["పీఎం కిసాన్ పథకం గురించి చెప్పండి", "సేంద్రీయ కీటక నివారిణి ఎలా చేయాలి?", "వరి పండించే పద్ధతులు"]
        suggestions_hi = ["पीएम-किसान योजना के बारे में बताएं", "टमाटर के कीटों से बचाव कैसे करें?", "जैविक कीटनाशक बनाने की विधि"]
        
        active_sug = suggestions_en
        if language == "te":
            active_sug = suggestions_te
        elif language == "hi":
            active_sug = suggestions_hi

        return AIChatResponse(
            response=active_db[matched_key],
            suggestions=active_sug
        )
