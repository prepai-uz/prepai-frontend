import React, { useState, useEffect } from "react";

export default function Mock1Reading() {
  const [activePassage, setActivePassage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [fontSize, setFontSize] = useState(15);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 daqiqa

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (qNum, val) => {
    setAnswers((prev) => ({ ...prev, [qNum]: val }));
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      width: "100vw", height: "100vh",
      backgroundColor: "#fff",
      display: "flex", flexDirection: "column",
      zIndex: 9999999, fontFamily: "Arial, sans-serif",
      margin: 0, padding: 0
    }}>
      
      {/* 1. TOP HEADER */}
      <div style={{
        height: "50px", backgroundColor: "#0f172a", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", boxSizing: "border-box"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "16px", color: "#38bdf8" }}>
          IELTS Academic Reading Mock 1
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px" }}>Text Size:</span>
          <button onClick={() => setFontSize((p) => Math.max(p - 2, 12))} style={{ padding: "2px 8px", cursor: "pointer" }}>A-</button>
          <button onClick={() => setFontSize(15)} style={{ padding: "2px 8px", cursor: "pointer" }}>Reset</button>
          <button onClick={() => setFontSize((p) => Math.min(p + 2, 22))} style={{ padding: "2px 8px", cursor: "pointer" }}>A+</button>
        </div>

        <div style={{ backgroundColor: "#0284c7", padding: "5px 15px", borderRadius: "4px", fontWeight: "bold" }}>
          ⏱️ Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      {/* 2. MAIN CONTENT (50% / 50%) */}
      <div style={{
        flex: 1, display: "flex", width: "100%",
        height: "calc(100vh - 105px)", boxSizing: "border-box"
      }}>
        
        {/* CHAP TOMON: MATNLAR (50%) */}
        <div style={{
          width: "50%", height: "100%", padding: "20px 30px", overflowY: "auto",
          borderRight: "2px solid #cbd5e1", boxSizing: "border-box",
          fontSize: `${fontSize}px`, lineHeight: "1.7", color: "#1e293b", backgroundColor: "#ffffff"
        }}>
          {activePassage === 1 && (
            <div>
              <h2 style={{ marginTop: 0, color: "#0f172a" }}>Reading Passage 1</h2>
              <h3 style={{ color: "#0369a1" }}>The History of Early Human Agricultural Innovations</h3>
              
              <p>The transition from nomadic foraging to settled agriculture represents one of the most profound turning points in human history. This monumental shift, often referred to as the Neolithic Revolution, was not an event that occurred overnight, but rather a gradual process that unfolded over thousands of years across various regions of the globe. Early human communities began to observe the life cycles of wild plants, eventually learning to cultivate seeds and domesticate wild animals. These fundamental technological <b>innovations</b> permanently altered the trajectory of human societies, enabling population growth and the eventual emergence of complex civilizations.</p>
              
              <p>In these early agricultural settlements, survival depended heavily on the seasonal <b>harvest</b>. Unlike nomadic hunter-gatherers who moved constantly in search of food, early farmers had to plan ahead, planting crops during specific seasons and storing the surplus to survive harsh weather conditions and periods of drought. Food storage required new techniques, leading to the development of pottery and specialized granaries designed to keep grain safe from moisture and pests.</p>
              
              <p>Processing plant materials also required the invention of primitive mechanical devices. Extracted plant <b>oil</b>, derived from seeds and olives, became a valuable commodity used not only for lighting lamps and cooking, but also for food preservation and ceremonial rituals. Furthermore, fibrous plants such as flax and hemp were carefully harvested and woven into strong <b>cords</b> and ropes. These flexible lines were vital for securing heavy bundles, crafting durable fishing nets, and constructing basic architectural shelters.</p>
              
              <p>In cooler geographic regions, communities needed innovative ways to maintain comfortable living conditions during severe weather. Dried <b>grass</b> and straw were gathered in large quantities to provide effective insulation inside thatched roofs and mud-brick walls. Maintaining a stable internal <b>temperature</b> was crucial for survival, particularly during prolonged winter months when outdoor cold could be life-threatening.</p>
              
              <p>Preparing harvested grain for consumption was a labor-intensive task that led to significant advances in stoneworking technology. Grinding wheat and barley required durable tools, which were fashioned from smooth <b>stones</b> found in riverbeds. These grinding stones, known as querns, were carefully shaped over generations to maximize efficiency. Social structures naturally revolved around the local <b>tribe</b>, where critical knowledge about crop rotation, seasonal weather patterns, and tool manufacturing was preserved and passed down orally from elders to younger generations.</p>

              <p>As agricultural techniques matured, populations expanded rapidly, necessitating the creation of larger-scale infrastructure. Irrigation systems were engineered to channel water from major rivers directly into distant agricultural fields. This technological advance allowed crops to flourish in previously arid landscapes, yielding unprecedented agricultural surpluses that eventually spurred trade between neighboring regions and laid the structural foundation for the world's earliest cities.</p>
            </div>
          )}

          {activePassage === 2 && (
            <div>
              <h2 style={{ marginTop: 0, color: "#0f172a" }}>Reading Passage 2</h2>
              <h3 style={{ color: "#0369a1" }}>Urban Planning in the 21st Century</h3>
              
              <p><b>Section A:</b> As the global population continues to urbanize at an unprecedented rate, modern cities face acute challenges regarding housing density, transportation infrastructure, and environmental sustainability. Traditional urban models, designed around personal motor vehicles and sprawling suburban developments, are increasingly recognized as ecologically unsustainable and socially isolating. In response, contemporary architects and urban planners are pioneering innovative strategies to redesign human settlements for the 21st century.</p>
              
              <p><b>Section B:</b> One concept that has gained widespread international support is the "15-minute city" urban design framework. Originating as a response to urban congestion and prolonged commuting times, this planning philosophy ensures that all city residents can access their daily essential needs—including employment, healthcare, education, grocery shopping, and recreational parks—within a 15-minute walk or bicycle ride from their doorsteps. By decentralizing essential services, cities can dramatically reduce reliance on private automobiles, thereby lowering greenhouse gas emissions and improving public health through active mobility.</p>
              
              <p><b>Section C:</b> In tandem with spatial redesign, modern infrastructure is being revolutionized through the integration of smart technology and green building materials. Smart electrical grids utilize real-time data to optimize energy distribution and seamlessly integrate renewable energy sources, such as solar and wind power. Additionally, modern skyscrapers are increasingly built using advanced timber and fitted with photovoltaic solar facades. Smart thermal regulation systems within these structures automatically adjust heating and cooling, resulting in a dramatic reduction in electricity consumption during peak hours.</p>
              
              <p><b>Section D:</b> Despite these technological advancements, rapid urban redevelopment carries significant socioeconomic risks, most notably gentrification. When neglected urban neighborhood centers are revitalized with luxury eco-apartments and trendy commercial spaces, property values and rental prices frequently skyrocket. Consequently, long-term lower-income residents are often displaced, forced to move to peripheral areas with inferior public amenities. Urban planners are now challenged to balance green commercial innovation with social equity to ensure inclusive city environments for all income brackets.</p>
              
              <p><b>Section E:</b> Public transportation systems are undergoing a parallel transformation. Metropolitan authorities are investing heavily in electric autonomous bus fleets, dedicated bus rapid transit (BRT) lanes, and expanded protected cycling networks. By prioritizing clean, shared transit options over private car ownership, forward-thinking municipalities are successfully reducing traffic congestion, curbing urban noise, and restoring cleaner air quality to urban centers worldwide.</p>
            </div>
          )}

          {activePassage === 3 && (
            <div>
              <h2 style={{ marginTop: 0, color: "#0f172a" }}>Reading Passage 3</h2>
              <h3 style={{ color: "#0369a1" }}>The Psychology of Human Decision Making</h3>
              
              <p><b>Paragraph 1:</b> For centuries, classical economic theories were built upon the fundamental assumption that human beings are rational actors who consistently make logical decisions to maximize their personal benefit. However, pioneering work in behavioral economics and cognitive psychology over the past half-century has thoroughly debunked this ideal portrait. Human decision-making is rarely purely rational; instead, it is systematically distorted by a vast array of subconscious cognitive biases and emotional factors that influence choices in everyday life, ranging from personal financial spending to high-level political policy decisions.</p>
              
              <p><b>Paragraph 2:</b> Cognitive psychologists Daniel Kahneman and Amos Tversky conceptualized human thought as operating through two distinct mental systems: System 1 and System 2. System 1 operates automatically, fast, and with little or no conscious effort. It allows humans to make split-second decisions necessary for survival, such as dodging an oncoming vehicle. However, because System 1 relies heavily on mental shortcuts known as heuristics, it is highly prone to predictable errors in judgment. System 2, by contrast, handles slow, analytical, and effortful mental calculations, such as solving a complex mathematical equation or analyzing a legal contract.</p>
              
              <p><b>Paragraph 3:</b> One of the most prevalent cognitive heuristics identified by researchers is the "anchoring effect." This cognitive bias occurs when individuals rely far too heavily on the initial piece of information presented to them when making a judgment or decision. Even if the initial number or detail is completely irrelevant to the actual value, subsequent estimates are subconsciously adjusted relative to that initial "anchor." In commercial negotiations, for example, the first price mentioned sets a powerful mental anchor that sways the final agreed-upon outcome.</p>
              
              <p><b>Paragraph 4:</b> Another pervasive cognitive distortion is confirmation bias—the subconscious tendency for individuals to seek out, interpret, and remember information that confirms their preexisting beliefs, while simultaneously ignoring or discounting contradictory evidence. In today's digital era, this psychological vulnerability is severely exacerbated by social media algorithms. By continuously feeding users content that aligns with their personal biases, these platforms construct algorithmic echo chambers that deepen societal polarization and impede rational public discourse.</p>
              
              <p><b>Paragraph 5:</b> Furthermore, human decision-making is powerfully governed by the principle of loss aversion. Extensive psychological experiments demonstrate that the emotional pain of losing something is roughly twice as powerful as the pleasure experienced from acquiring an equivalent gain. This psychological asymmetry explains why individual investors frequently hold onto declining financial stocks far too long—hoping to avoid realizing a painful loss—and why large organizations often fiercely resist necessary structural reforms due to a fear of losing status or security.</p>
            </div>
          )}
        </div>

        {/* O'NG TOMON: SAVOLLAR (50%) */}
        <div style={{
          width: "50%", height: "100%", padding: "20px 30px", overflowY: "auto",
          boxSizing: "border-box", backgroundColor: "#f8fafc"
        }}>
          {/* PASSAGE 1 SAVOLLARI */}
          {activePassage === 1 && (
            <div>
              <h3 style={{ marginTop: 0, color: "#0f172a" }}>Questions 1–8</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Complete the notes below. Choose <b>ONE WORD ONLY</b> from the passage for each answer.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {[
                  { q: 1, text: "Farming relied on key technical _______." },
                  { q: 2, text: "Storing the seasonal _______ was crucial for survival." },
                  { q: 3, text: "Extracted _______ was used for fuel and lamps." },
                  { q: 4, text: "Plant fibers were turned into strong _______." },
                  { q: 5, text: "Homes were insulated using dried _______." },
                  { q: 6, text: "Controlling the inside _______ was necessary." },
                  { q: 7, text: "Grain grinding tools were crafted from _______." },
                  { q: 8, text: "Knowledge was shared within the local _______." }
                ].map((item) => (
                  <div key={item.q} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <b style={{ width: "30px" }}>{item.q}.</b>
                    <span style={{ flex: 1 }}>{item.text}</span>
                    <input type="text" value={answers[item.q] || ""} onChange={(e) => handleInputChange(item.q, e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", width: "130px" }} />
                  </div>
                ))}
              </div>

              <h3 style={{ color: "#0f172a" }}>Questions 9–13</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Do the following statements agree with the information in Reading Passage 1? Write <b>TRUE</b>, <b>FALSE</b>, or <b>NOT GIVEN</b>.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { q: 9, text: "The transition to agriculture occurred quickly across all global regions." },
                  { q: 10, text: "Plant oil was exclusively used for food preservation purposes." },
                  { q: 11, text: "Dried grass provided thermal insulation for thatched roofs." },
                  { q: 12, text: "Riverbed stones were used to construct agricultural irrigation channels." },
                  { q: 13, text: "Elders recorded farming knowledge using early written symbols." }
                ].map((item) => (
                  <div key={item.q} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <div><b>{item.q}.</b> {item.text}</div>
                    <div style={{ display: "flex", gap: "15px" }}>
                      {["TRUE", "FALSE", "NOT GIVEN"].map((opt) => (
                        <label key={opt} style={{ fontSize: "13px", cursor: "pointer" }}>
                          <input type="radio" name={`q_${item.q}`} value={opt} checked={answers[item.q] === opt} onChange={() => handleInputChange(item.q, opt)} /> {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASSAGE 2 SAVOLLARI */}
          {activePassage === 2 && (
            <div>
              <h3 style={{ marginTop: 0, color: "#0f172a" }}>Questions 14–18</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Which Section (<b>A–E</b>) contains the following information? Write the correct letter in the box.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {[
                  { q: 14, text: "An explanation of how smart grids optimize energy distribution." },
                  { q: 15, text: "The concept of fulfilling daily needs within a short walk or bike ride." },
                  { q: 16, text: "The negative impact of gentrification on low-income residents." },
                  { q: 17, text: "The drawbacks of traditional motor vehicle-centric urban planning." },
                  { q: 18, text: "Investments in electric autonomous bus fleets and cycling paths." }
                ].map((item) => (
                  <div key={item.q} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <b style={{ width: "30px" }}>{item.q}.</b>
                    <span style={{ flex: 1 }}>{item.text}</span>
                    <input type="text" maxLength={1} value={answers[item.q] || ""} onChange={(e) => handleInputChange(item.q, e.target.value.toUpperCase())} style={{ padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", width: "60px", textAlign: "center" }} placeholder="A-E" />
                  </div>
                ))}
              </div>

              <h3 style={{ color: "#0f172a" }}>Questions 19–26</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b>, or <b>D</b>.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { q: 19, text: "The 15-minute city model aims to reduce reliance on:", opts: ["A) Public buses", "B) Private automobiles", "C) Bicycles", "D) Local stores"] },
                  { q: 20, text: "Photovoltaic solar facades on skyscrapers help to:", opts: ["A) Lower housing density", "B) Reduce electricity usage", "C) Increase rental prices", "D) Expand suburban zones"] },
                  { q: 21, text: "Gentrification often causes lower-income populations to:", opts: ["A) Buy new eco-apartments", "B) Move to city peripheries", "C) Avoid public transit", "D) Build smart grids"] },
                  { q: 22, text: "Dedicated BRT lanes are designed to improve:", opts: ["A) Private car speed", "B) Shared public transport", "C) Pedestrian walking paths", "D) Commercial shipping"] },
                  { q: 23, text: "Modern architects are increasingly replacing traditional materials with:", opts: ["A) Advanced timber", "B) Plastic composites", "C) Heavy unrefined steel", "D) Mud bricks"] },
                  { q: 24, text: "Urban planners must balance commercial innovation with:", opts: ["A) Foreign trade", "B) Social equity", "C) Car parking space", "D) Noise pollution"] },
                  { q: 25, text: "Smart thermal regulation systems adjust:", opts: ["A) Solar radiation", "B) Heating and cooling", "C) Bus arrival times", "D) Property taxes"] },
                  { q: 26, text: "Active mobility in 15-minute cities promotes better:", opts: ["A) Public health", "B) Automobile sales", "C) Suburb expansion", "D) Industrial growth"] }
                ].map((item) => (
                  <div key={item.q} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <div><b>{item.q}.</b> {item.text}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {item.opts.map((opt) => (
                        <label key={opt} style={{ fontSize: "13px", cursor: "pointer" }}>
                          <input type="radio" name={`q_${item.q}`} value={opt[0]} checked={answers[item.q] === opt[0]} onChange={() => handleInputChange(item.q, opt[0])} /> {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASSAGE 3 SAVOLLARI */}
          {activePassage === 3 && (
            <div>
              <h3 style={{ marginTop: 0, color: "#0f172a" }}>Questions 27–32</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Do the following statements agree with the claims of the writer? Write <b>YES</b>, <b>NO</b>, or <b>NOT GIVEN</b>.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {[
                  { q: 27, text: "Classical economic theory correctly assumed that human behavior is always logical." },
                  { q: 28, text: "System 1 thinking requires deliberate, analytical concentration." },
                  { q: 29, text: "An initial anchor price can influence final commercial deal negotiations." },
                  { q: 30, text: "Social media algorithms help reduce societal political polarization." },
                  { q: 31, text: "People generally experience stronger emotions from losing than gaining something." },
                  { q: 32, text: "System 2 operations occur automatically without conscious mental effort." }
                ].map((item) => (
                  <div key={item.q} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <div><b>{item.q}.</b> {item.text}</div>
                    <div style={{ display: "flex", gap: "15px" }}>
                      {["YES", "NO", "NOT GIVEN"].map((opt) => (
                        <label key={opt} style={{ fontSize: "13px", cursor: "pointer" }}>
                          <input type="radio" name={`q_${item.q}`} value={opt} checked={answers[item.q] === opt} onChange={() => handleInputChange(item.q, opt)} /> {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{ color: "#0f172a" }}>Questions 33–40</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Complete the summary below. Choose <b>ONE WORD ONLY</b> from the passage for each answer.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { q: 33, text: "System 1 thinking makes quick decisions using shortcuts called _______." },
                  { q: 34, text: "System 2 is responsible for slow and _______ mental calculations." },
                  { q: 35, text: "The anchoring effect relies heavily on the _______ piece of information received." },
                  { q: 36, text: "Confirmation bias causes individuals to ignore _______ evidence." },
                  { q: 37, text: "Social media platforms create algorithmic echo _______." },
                  { q: 38, text: "Loss aversion suggests that the psychological pain of loss is _______." },
                  { q: 39, text: "Investors often refuse to sell declining stocks due to fear of realizing a _______." },
                  { q: 40, text: "Large companies resist structural reforms to avoid losing their status or _______." }
                ].map((item) => (
                  <div key={item.q} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <b style={{ width: "30px" }}>{item.q}.</b>
                    <span style={{ flex: 1 }}>{item.text}</span>
                    <input type="text" value={answers[item.q] || ""} onChange={(e) => handleInputChange(item.q, e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", width: "130px" }} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. FOOTER (NAVIGATSIYA TUGMALARI) */}
      <div style={{
        height: "55px", backgroundColor: "#0f172a",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", boxSizing: "border-box"
      }}>
        {/* PASSAGE TUGMALARI */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setActivePassage(p)}
              style={{
                padding: "8px 16px", borderRadius: "4px", border: "none",
                fontWeight: "bold", cursor: "pointer",
                backgroundColor: activePassage === p ? "#0284c7" : "#334155",
                color: "#fff"
              }}
            >
              Passage {p}
            </button>
          ))}
        </div>

        {/* 1 - 40 SAVOL TUGMALARI */}
        <div style={{ display: "flex", gap: "4px", overflowX: "auto", maxWidth: "65%" }}>
          {Array.from({ length: 40 }, (_, i) => i + 1).map((num) => {
            let belongToPassage = 1;
            if (num >= 14 && num <= 26) belongToPassage = 2;
            if (num >= 27) belongToPassage = 3;

            const isAnswered = !!answers[num];

            return (
              <button
                key={num}
                onClick={() => setActivePassage(belongToPassage)}
                style={{
                  width: "28px", height: "28px", borderRadius: "4px",
                  border: isAnswered ? "2px solid #38bdf8" : "1px solid #475569",
                  backgroundColor: isAnswered ? "#0284c7" : "#1e293b",
                  color: "#fff", fontWeight: "bold", fontSize: "11px", cursor: "pointer"
                }}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}