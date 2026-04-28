import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
const PaintCan3D = React.lazy(() => import("./components/PaintCan3D"));
import { 
  ShieldCheck, 
  Droplet, 
  Wind, 
  Paintbrush, 
  Sparkles, 
  Layers, 
  MousePointer2, 
  Award,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Info
} from "lucide-react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  key?: React.Key;
}

const FadeIn = ({ children, delay = 0, direction = "up", className }: FadeInProps) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0
    },
    visible: { opacity: 1, y: 0, x: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Product Detail Component ---
interface ProductDetailProps {
  product: any;
  onClose: () => void;
}

const ProductDetail = ({ product, onClose }: ProductDetailProps) => {
  const [show3D, setShow3D] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[200] bg-brand-bg overflow-y-auto px-6 py-24 md:p-24"
    >
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onClose}
          className="flex items-center gap-3 text-brand-400 hover:text-brand-950 transition-colors uppercase text-xs tracking-widest font-bold mb-16 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 返回产品列表
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="sticky top-24">
            <div className="relative aspect-square rounded-sm overflow-hidden border border-brand-sep bg-white shadow-2xl group/can">
              {show3D ? (
                <div className="w-full h-full cursor-grab active:cursor-grabbing">
                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-serif italic text-brand-300">载入 3D 模型...</div>}>
                    <PaintCan3D labelTextureUrl={product.labelTexture} className="w-full h-full" />
                  </Suspense>
                </div>
              ) : (
                <div className="w-full h-full bg-[radial-gradient(circle_at_50%_30%,_#f3f4f6_0%,_#d1d5db_60%,_#9ca3af_100%)] flex flex-col items-center justify-center shadow-inner">
                  {/* Abstract placeholder logo mimicking German minimalism */}
                  <div className="text-brand-900/5 font-serif text-8xl md:text-9xl italic tracking-tighter mix-blend-color-burn">M</div>
                </div>
              )}
              
              <div className="absolute top-8 left-8 pointer-events-none">
                <span className="text-6xl font-serif text-brand-gold opacity-20">{product.step}</span>
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-brand-sep transition-opacity duration-300 shadow-sm">
                <button 
                  onClick={() => setShow3D(true)}
                  className={`text-[9px] tracking-widest font-bold uppercase px-3 py-1 rounded-full transition-colors ${show3D ? 'bg-brand-950 text-white' : 'text-brand-400 hover:text-brand-950'}`}
                >
                  3D View
                </button>
                <div className="w-px h-3 bg-brand-sep" />
                <button 
                  onClick={() => setShow3D(false)}
                  className={`text-[9px] tracking-widest font-bold uppercase px-3 py-1 rounded-full transition-colors ${!show3D ? 'bg-brand-950 text-white' : 'text-brand-400 hover:text-brand-950'}`}
                >
                  Photo
                </button>
              </div>

              {show3D && (
                <div className="absolute top-6 right-6 pointer-events-none text-[8px] tracking-[0.2em] text-brand-300 uppercase font-bold flex flex-col items-end gap-1 z-20">
                  <span>360° Interactive</span>
                  <div className="flex gap-1">
                    <MousePointer2 size={10} className="animate-bounce" />
                    <span>Drag to rotate</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <span className="text-[10px] tracking-[0.4em] text-brand-gold uppercase mb-4 block font-bold">{product.label}</span>
              <h2 className="text-5xl md:text-6xl font-serif text-brand-900 mb-6">{product.title}</h2>
              <p className="text-brand-600 text-lg font-light leading-relaxed">{product.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-y border-brand-sep">
              {product.specs.map((spec: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-[10px] tracking-widest text-brand-400 uppercase font-bold">{spec.name}</h4>
                  <p className="text-brand-900 font-medium">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-xs tracking-[0.2em] text-brand-950 uppercase font-bold flex items-center gap-3">
                <Info size={14} className="text-brand-gold" /> 产品应用数据
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {product.details.map((detail: string, idx: number) => (
                  <div key={idx} className="flex gap-4 p-6 bg-white border border-brand-sep rounded-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2 shrink-0" />
                    <p className="text-brand-600 text-sm leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const products = [
    {
      step: "01",
      label: "PRIMER BASE",
      title: "拾光·初肌底漆",
      tagline: "Foundation Base",
      desc: "融合高遮盖因子，专为重塑墙面基底色彩设计。有效遮盖基层瑕疵与色差，提供卓越的封闭性能，为后续面漆显色提供均匀、通透的“初肌”底色。",
      features: ["卓越遮盖能力", "有效封闭碱性", "提升附着力"],
      image: "/assets/images/primer-product.jpg",
      labelTexture: "/assets/images/primer-label.jpg",
      specs: [
        { name: "树脂类型", value: "100% 自交联丙烯酸树脂乳液" },
        { name: "光泽度", value: "< 5% @ 60° (极致哑光)" },
        { name: "理论涂刷", value: "35m² / 5kg / 桶" },
        { name: "储存条件", value: "避光, 5-35℃, 12个月" }
      ],
      details: [
        "稀释建议：初肌底漆:水 = 1:0.05（质量比），不建议过度稀释以免降低遮盖与封闭性能。",
        "干燥时间：表干约1小时，重涂间隔需4小时以上（25℃环境）。",
        "施工建议：必须配套拾光系列面漆使用，以达到最佳物理性能。"
      ]
    },
    {
      step: "02",
      label: "VELVET TOPCOAT",
      title: "拾光 · 蛋壳漆",
      tagline: "Velvet Topcoat",
      desc: "引入美国核心自交联涂料配方，核心 5-10° 柔光技术。触感细腻如脂，拥有卓越的遮盖力与 1784 种精准色效还原，为空间铺设如蛋壳般的溫润肤感。",
      features: ["5-10° 柔光技术", "触感细腻如脂", "卓越遮盖力"],
      image: "/assets/images/eggshell-product.jpg",
      labelTexture: "/assets/images/eggshell-label.jpg",
      specs: [
        { name: "树脂类型", value: "纯丙烯酸 / 聚氨酯树脂复合体系" },
        { name: "耐洗刷次数", value: "20,000+ 次 (超强抗刮擦/耐刷洗)" },
        { name: "色彩体系", value: "1784 种配色标准" },
        { name: "光泽度", value: "5-10% @ 60° (标准蛋壳光)" },
        { name: "环保标准", value: "趋0甲醛及VOC / 法国 A+ 认证" }
      ],
      details: [
        "理论用量：1桶（4.7kg 浅/深基）涂刷约 20m² (两遍)，视基底吸水率而异。",
        "物理特性：国家0级防霉标准，28天面对8种常见霉菌无任何生长迹象，抗菌率 99.9%。",
        "施工顺序：底漆一遍完全干透后，辊涂/喷涂两遍拾光含色面漆。"
      ]
    },
    {
      step: "03",
      label: "SHIELD PROTECT",
      title: "拾光·荷净罩面漆",
      tagline: "Shield Protect",
      desc: "专为厨卫空间、卫浴干区等高湿度环境设计。荷叶式自洁拒水，持久固色防霉，形成肉眼难见的极致拒水层。即使是酱油、番茄酱等粘稠污渍，亦能一抹即净。",
      features: ["荷叶式拒水", "持久固色防霉", "适用卫浴干区"],
      image: "/assets/images/shield-product.jpg",
      labelTexture: "/assets/images/shield-label.jpg",
      specs: [
        { name: "树脂类型", value: "水性有机硅树脂乳液 (极致疏水)" },
        { name: "外观", value: "全透明保护层 (不改变面漆原色)" },
        { name: "理论涂刷", value: "60m² / 3.7kg / 桶 (一遍)" },
        { name: "功能亮点", value: "荷叶效应 / 极强自清洁力" }
      ],
      details: [
        "特殊建议：不建议加水稀释，以免破坏有机硅分子的成膜致密度。",
        "适用场景：推荐用于卫生间、厨房、开放式水吧台等易溅水区域。",
        "日常保养：涂刷28天后性能达到巅峰，可用洗涤剂正常擦洗。"
      ]
    }
  ];

  return (
    <div className="relative overflow-x-hidden selection:bg-brand-gold selection:text-white brand-gradient min-h-screen">
      <div className="texture-overlay fixed inset-0 z-[110] pointer-events-none" />

      <AnimatePresence>
        {activeProduct && (
          <ProductDetail 
            product={activeProduct} 
            onClose={() => setActiveProduct(null)} 
          />
        )}
        {selectedFeature && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white p-12 rounded-sm shadow-2xl border border-brand-sep overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="p-2 text-brand-300 hover:text-brand-gold transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-sm bg-brand-bg border border-brand-sep flex items-center justify-center mb-8">
                  {React.cloneElement(selectedFeature.icon as React.ReactElement, { size: 32 })}
                </div>
                <span className="text-[10px] tracking-[0.4em] text-brand-gold uppercase mb-3 block font-bold">Scientific Analysis</span>
                <h3 className="text-3xl font-serif text-brand-900 mb-8">{selectedFeature.title}</h3>
                <div className="h-px w-12 bg-brand-gold mb-8 opacity-30" />
                <p className="text-brand-600 text-sm leading-relaxed font-light tracking-wide">
                  {selectedFeature.longDesc}
                </p>
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="mt-12 px-8 py-3 bg-brand-950 text-white text-[10px] tracking-widest font-bold uppercase rounded-sm hover:bg-brand-gold transition-colors"
                >
                  Confirm & Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 px-6 md:px-12 py-4 ${isScrolled ? "bg-white/80 backdrop-blur-md border-b border-brand-sep" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.4em] uppercase text-brand-400 mb-0.5">YULAN HOME</span>
              <span className="text-xl font-light tracking-tight text-brand-900 uppercase tracking-[0.1em]">拾光 <span className="text-brand-gold">·</span> 功能性纯色漆系列</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
            {["产品由来", "核心优势", "色彩优势", "产品体系", "全案融合"].map((item) => (
              <a key={item} href={`#${item}`} className="text-brand-50 hover:text-brand-gold transition-colors">
                {item}
              </a>
            ))}
          </div>

          <button className="md:hidden p-2 text-brand-950" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[80] bg-white pt-24 px-8 md:hidden">
          <div className="flex flex-col gap-6 text-2xl font-light">
            {["产品由来", "核心优势", "色彩优势", "产品体系", "全案融合"].map((item) => (
              <a 
                key={item} 
                href={`#${item}`} 
                className="text-brand-900"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/hero-bg.jpeg" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-90 contrast-100 brightness-[0.85] saturate-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80";
            }}
          />
          <div className="absolute inset-0 bg-brand-bg/70 z-1" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <FadeIn direction="down" delay={0.2}>
            <div className="h-1 w-20 bg-brand-gold mx-auto mb-10" />
          </FadeIn>
          <FadeIn delay={0.4}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl whitespace-nowrap font-serif text-brand-900 mb-8 tracking-tight leading-tight">
              拾光<span className="text-brand-gold"> · </span>功能性纯色漆系列
            </h1>
          </FadeIn>
          <FadeIn delay={0.6}>
            <p className="text-sm md:text-base text-brand-800 max-w-xl mx-auto font-light leading-relaxed mb-12 tracking-wide">
              极致物理性能与美学的平衡。在光影交织间，捕捉墙面的艺术触感。引入美国核心涂料技术配方，提供包含蛋壳微光、云绒哑光在内的全系列美系纯正色彩方案，为高端空间定制如肌肤般的温润触感。
            </p>
          </FadeIn>
          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a href="#产品体系" className="px-12 py-4 bg-brand-950 text-white rounded-[2px] text-[11px] font-bold tracking-[0.2em] hover:bg-brand-gold transition-all uppercase">
                EXPLORE COLLECTION
              </a>
              <div className="flex items-center gap-4 text-[10px] tracking-[0.3em] font-medium text-brand-400 uppercase">
                <span>美国核心技术</span>
                <div className="w-[1px] h-3 bg-brand-sep" />
                <span>德系工匠品质</span>
              </div>
            </div>
          </FadeIn>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.2em] text-brand-300 uppercase">Scroll Down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-300 to-transparent" />
        </motion.div>
      </section>

      {/* Origin Section */}
      <section id="产品由来" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn direction="right">
              <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden shadow-2xl">
                  <img 
                    src="/assets/images/company-heritage.jpeg" 
                    alt="Wallcovering Expertise Heritage" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 opacity-100 contrast-100 saturate-100"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542887800-faca0261c9e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 text-white relative z-10">
                  <p className="text-4xl font-serif">42 Years</p>
                  <p className="text-xs tracking-widest uppercase opacity-80 mt-1 font-medium">Wallcovering Expertise</p>
                </div>
              </div>
            </FadeIn>
            <div>
              <FadeIn direction="left">
                <span className="text-[10px] tracking-[0.3em] text-brand-gold font-bold uppercase mb-4 block">Our Heritage</span>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-8 leading-tight">
                  匠心拾光，<br />成就你的理想家
                </h2>
                <div className="space-y-6 text-brand-600 font-light leading-relaxed">
                  <p>
                    玉兰集团旗下玉兰家居（YULAN HOME），历经 42 年深耕室内装饰材料，在墙面装饰领域积累了极其深厚的研发与制造经验。针对现代家居的多元化高阶诉求，我们在业内正式突破，推出“拾光 · 功能性纯色漆系列”。
                  </p>
                  <p>
                    引入正宗的美国核心涂料技术配方，结合玉兰 190 多项自主研发专利。它不仅是单纯的性能涂料，更是能够与高定无缝墙布、专属艺术墙画完美统一的家庭美学载体，为您营造极具格调的沉浸式生活空间。
                  </p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 border-t border-brand-sep pt-8">
                  <div>
                    <p className="text-3xl font-serif text-brand-900 mb-2">42<span className="text-xl text-brand-gold ml-1">年</span></p>
                    <p className="text-[10px] tracking-widest text-brand-400 uppercase font-medium">国民大品牌背书</p>
                  </div>
                  <div>
                    <p className="text-3xl font-serif text-brand-900 mb-2">190<span className="text-xl text-brand-gold ml-1">+</span></p>
                    <p className="text-[10px] tracking-widest text-brand-400 uppercase font-medium">独家核心专利技术</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section id="核心优势" className="py-32 bg-white relative overflow-hidden border-y border-brand-sep">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <FadeIn direction="down">
              <span className="text-[10px] tracking-[0.4em] text-brand-gold font-bold uppercase mb-4 block">Core Performance</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-brand-900">极致物理特性与环保标准</h2>
              <p className="text-brand-500 max-w-xl mx-auto font-light text-sm tracking-wide mt-6">不仅仅是色彩，更是全方位的硬核守护。解决售后难题，赢得客户口碑。</p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-brand-sep bg-white shadow-sm">
            {[
              { icon: <MousePointer2 className="text-brand-gold" />, title: "蛋壳光泽", desc: "5-10% @ 60° 溫润微光，有效消除视觉疲劳，赋予空间高级质感。", longDesc: "采用核心 5-10° 柔光平衡技术，光影过渡如蛋壳般自然。5-10% 的漫反射率有效减少视觉刺激，缓解眼部疲劳，营造高级简约的视觉享受。无需复杂工艺，涂抹效果自带高级感。" },
              { icon: <Droplet className="text-brand-gold" />, title: "荷叶拒水", desc: "专利拒水分子分散技术，水珠如落荷叶般滚落，轻松应对厨卫潮湿。", longDesc: "集成有机硅聚合物定向排布技术，在漆膜表面形成致密纳米疏水层。污垢如水珠般在表面滚落，特别适用于开放式水吧、厨房等高湿度区域，长效干爽，告别墙面污渍售后烦恼。" },
              { icon: <ShieldCheck className="text-brand-gold" />, title: "超强耐刷", desc: "通过 20,000+ 次耐洗刷测试，远超国家优等品标准，历久弥新。", longDesc: "采用特殊高分子自交联树脂体系，成膜致密均匀。经权威测试，耐洗刷性能超过 20,000 次，是国家一等品标准的 10 倍以上，有效抵抗日常油污与磨损，让墙面历久弥新。" },
              { icon: <Wind className="text-brand-gold" />, title: "环保净味", desc: "趋 0 甲醛及零 VOC 排放。轻松达到A+认证标准，呵护全家健康。", longDesc: "全线严选净味级环保原材料，生产过程中无添加任何有害物质。满足法国 VOC 排放 A+ 级别认证及中国十环认证，实现真正的“施工后即刻入住”，成为谈单的绝佳利器。" },
              { icon: <Sparkles className="text-brand-gold" />, title: "防霉抗菌", desc: "国家 0 级防霉等级。28 天面对 8 种霉菌“不生长”，抗菌率达 99.9%。", longDesc: "通过国家最高 0 级防霉标准。即便在潮湿阴暗环境下，面对 8 种常见致病性霉菌依然能实现“0 生长”，抗菌率高达 99.9% 以上，从根源上保障儿童房等敏感空间安全。" },
              { icon: <Layers className="text-brand-gold" />, title: "极易施工", desc: "融合极佳流平行和遮盖因子，降低施工门槛，大面涂刷无接茬痕迹。", longDesc: "卓越的流平性和延长开放时间设计，让即使是经验一般的油漆工也能轻松应对大平层涂刷。有效减少接茬、色差问题，大幅降低施工过程中的翻车率和人工成本。" },
              { icon: <Award className="text-brand-gold" />, title: "大国精工", desc: "对标德系工匠标准，拾光系列旨在打破传统乳胶漆冰冷感，建立温暖触感。", longDesc: "不仅是涂料，更是工艺品。对标德系卓越制造工艺，每一桶拾光系列产品都经历了严苛的 52 道品控流程。我们打破了传统乳胶漆的塑料冰冷感，赋予墙面如肌肤般的温暖触理。" },
              { icon: <Paintbrush className="text-brand-gold" />, title: "强效遮盖", desc: "高分子乳液协同纳米级钛白粉，极少遍数即可完成饱满发色。", longDesc: "优选超细纳米级钛白粉，配合高固含量成膜因子。只需一遍底漆加两遍面漆即可实现深色基底的完美遮盖，发色饱满纯正，极大地节省了材料用量和涂刷耗时。" },
            ].map((feature, idx) => (
              <FadeIn 
                key={idx} 
                delay={idx * 0.05} 
                className="p-8 bg-white border-brand-sep border-r border-b group hover:bg-brand-bg transition-all duration-500 cursor-pointer relative"
              >
                <div 
                  className="absolute inset-0 z-10" 
                  onClick={() => setSelectedFeature(feature)} 
                />
                <div className="w-10 h-10 rounded-sm bg-brand-bg border border-brand-sep flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow text-brand-gold">
                  {feature.icon}
                </div>
                <div className="text-brand-900 text-[11px] font-bold tracking-[0.1em] mb-3 uppercase flex items-center justify-between group-hover:text-brand-gold transition-colors">
                  <span>{feature.title}</span>
                  <Info size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold delay-100" />
                </div>
                <p className="text-brand-500 text-[11px] font-medium leading-relaxed group-hover:text-brand-600 transition-colors">{feature.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Color Advantage */}
      <section id="色彩优势" className="py-32 bg-brand-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <FadeIn direction="right">
                <span className="text-[10px] tracking-[0.3em] text-brand-gold font-bold uppercase mb-4 block">Rich Palette</span>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-8 leading-tight">
                  纯正美系色彩体系<br />告别单一灰白
                </h2>
                <div className="space-y-6 text-brand-600 font-light leading-relaxed mt-10">
                  <p>
                    告别终端店面千篇一律的寡淡，依托美国原装配方及核心技术，我们在色彩体系上精准匹配了 <span className="font-semibold text-brand-900">1784</span> 种标准调色彩系。
                  </p>
                  <p>
                    摒弃廉价色浆，坚持全程采用 <span className="font-semibold text-brand-900">12 种原装进口高级色浆</span>。无论是复古莫兰迪、温馨大地色，还是低饱和度的高级灰，电脑自动调配均能实现极致纯正呈现。行业极限 <span className="font-semibold text-brand-900">&Delta;E*ab &le; 2.0</span> 色差标准，真正做到所见即所得，大幅提升签单成功率。
                  </p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 border-t border-brand-sep pt-8">
                  <div>
                    <p className="text-3xl font-serif text-brand-900 mb-2">1784</p>
                    <p className="text-[10px] tracking-widest text-brand-400 uppercase font-medium">Standard Colors</p>
                  </div>
                  <div>
                    <p className="text-3xl font-serif text-brand-900 mb-2">12</p>
                    <p className="text-[10px] tracking-widest text-brand-400 uppercase font-medium">Imported Colorants</p>
                  </div>
                </div>
              </FadeIn>
            </div>
            <FadeIn direction="left">
              <div className="relative aspect-square rounded-[2px] overflow-hidden shadow-2xl bg-white flex items-center justify-center p-6 border border-brand-sep">
                {/* Rich Color Blocks Displaying Paint Colors */}
                <div className="grid grid-cols-2 grid-rows-3 w-full h-full gap-3">
                  <div className="rounded-[2px] shadow-sm flex items-end p-5 transition-all duration-700 hover:scale-[0.98] hover:shadow-inner" style={{ backgroundColor: 'var(--color-paint-sage)' }}>
                    <div>
                      <p className="text-brand-950 font-serif text-lg tracking-tight mix-blend-color-burn opacity-100">Sage Mist</p>
                      <p className="text-[9px] tracking-widest text-brand-950/60 uppercase font-bold mt-1">Historic / YL-310</p>
                    </div>
                  </div>
                  <div className="rounded-[2px] shadow-sm flex items-end p-5 transition-all duration-700 hover:scale-[0.98] hover:shadow-inner" style={{ backgroundColor: 'var(--color-paint-terra)' }}>
                    <div>
                      <p className="text-brand-950 font-serif text-lg tracking-tight mix-blend-color-burn opacity-100">Terracotta</p>
                      <p className="text-[9px] tracking-widest text-white/70 uppercase font-bold mt-1">Evolution / YL-504</p>
                    </div>
                  </div>
                  <div className="rounded-[2px] shadow-sm flex items-end p-5 transition-all duration-700 hover:scale-[0.98] hover:shadow-inner" style={{ backgroundColor: 'var(--color-paint-navy)' }}>
                    <div>
                      <p className="text-brand-950 font-serif text-lg tracking-tight mix-blend-color-burn opacity-100">Deep Ocean</p>
                      <p className="text-[9px] tracking-widest text-white/70 uppercase font-bold mt-1">Color IS / YL-891</p>
                    </div>
                  </div>
                  <div className="rounded-[2px] shadow-sm flex items-end p-5 transition-all duration-700 hover:scale-[0.98] hover:shadow-inner" style={{ backgroundColor: 'var(--color-paint-sand)' }}>
                    <div>
                      <p className="text-brand-950 font-serif text-lg tracking-tight mix-blend-color-burn opacity-100">Warm Sand</p>
                      <p className="text-[9px] tracking-widest text-brand-950/60 uppercase font-bold mt-1">Historic / YL-205</p>
                    </div>
                  </div>
                  <div className="col-span-2 rounded-[2px] shadow-sm flex items-end justify-end p-6 transition-all duration-700 hover:scale-[0.98] hover:shadow-inner relative overflow-hidden" style={{ backgroundColor: 'var(--color-paint-stone)' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                    <div className="text-right">
                      <p className="text-[12px] tracking-[0.2em] text-brand-950 font-bold uppercase mb-2 mix-blend-color-burn opacity-70">Extreme Precision</p>
                      <p className="text-4xl font-serif text-white mb-1 drop-shadow-sm">&Delta;E*ab &le; 2.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Product System */}
      <section id="产品体系" className="py-32 bg-brand-bg border-t border-brand-sep">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <FadeIn direction="right">
                <span className="text-xs tracking-[0.3em] text-brand-400 uppercase mb-4 block">Product System</span>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-900">护肤级涂装体系</h2>
              </FadeIn>
            </div>
            <FadeIn direction="left">
              <p className="text-brand-600 max-w-sm font-light leading-relaxed">
                从底座到定妆，拾光系列为您定制墙面的高端“护肤”三步曲。
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {products.map((product, idx) => (
              <FadeIn key={idx} delay={idx * 0.2}>
                <div 
                  onClick={() => setActiveProduct(product)}
                  className={`bg-white rounded-sm overflow-hidden border border-brand-sep cursor-pointer hover:border-brand-gold/50 transition-all duration-700 h-full flex flex-col group ${idx === 1 ? 'border-brand-gold/30 shadow-md' : ''}`}
                >
                  <div className="relative aspect-video overflow-hidden border-b border-brand-sep bg-brand-bg">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#e5e7eb_0%,_#d1d5db_40%,_#9ca3af_100%)] opacity-60 group-hover:scale-105 transition-transform duration-1000 shadow-inner" />
                    <div className="absolute inset-0 bg-brand-950/0 group-hover:bg-brand-950/5 transition-colors" />
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`text-4xl font-serif ${idx === 1 ? 'text-brand-gold' : 'text-brand-200'} opacity-40`}>{product.step}</span>
                    </div>
                    <img 
                      src={`/assets/images/product_${idx === 0 ? 'base' : idx === 1 ? 'velvet' : 'shield'}.jpeg`}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // 如果本地图片加载失败，自动切换到符合德系极简风格的备用图
                        const fallbacks = [
                          "https://images.unsplash.com/photo-1615873968403-89e068628265?auto=format&fit=crop&w=800&q=80", // 细腻墙面肌理
                          "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=800&q=80", // 柔和室内光影
                          "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80"  // 抽象极简几何
                        ];
                        target.src = fallbacks[idx];
                      }}
                    />
                    <div className="absolute inset-0 bg-brand-950/0 group-hover:bg-brand-950/5 transition-colors z-10" />
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <h4 className="serif text-xl text-brand-900 mb-1">{product.title}</h4>
                    <p className={`text-[10px] uppercase tracking-widest mb-4 italic ${idx === 1 ? 'text-brand-gold font-bold' : 'text-brand-400'}`}>{product.tagline}</p>
                    <ul className="text-[11px] text-brand-600 space-y-2 mb-8">
                      {product.features.map(f => (
                        <li key={f}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Total Solution / Full Case Delivery */}
      <section id="全案融合" className="py-32 bg-white border-y border-brand-sep relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <FadeIn direction="down">
              <span className="text-[10px] tracking-[0.4em] text-brand-gold font-bold uppercase mb-4 block">Total Solution</span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-900">一站式全屋软装美学</h2>
              <p className="text-brand-500 max-w-xl mx-auto font-light text-sm tracking-wide mt-6">打破单品拼凑，实现无缝墙布、拾光功能漆、定制墙画与高定窗帘的美学闭环，为您定制专属品位空间。</p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <FadeIn delay={0.2} direction="up">
              <div className="border-t border-brand-sep pt-6">
                <div className="text-brand-gold font-serif text-3xl italic opacity-50 mb-4 transition-opacity hover:opacity-100">01.</div>
                <h4 className="serif text-lg mb-2 text-brand-900 font-medium tracking-wide">基底重塑：墙布与纯色漆的双重奏</h4>
                <p className="text-brand-500 text-[12px] font-light leading-relaxed">
                  客餐厅等大面积区域铺陈玉兰高端无缝墙布，营造无可平替的奢华肌理感；而在卫浴干区、儿童房等处应用拾光功能漆，充分发挥其硬核防护的魅力，让空间主次分明。
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <div className="border-t border-brand-sep pt-6">
                <div className="text-brand-gold font-serif text-3xl italic opacity-50 mb-4 transition-opacity hover:opacity-100">02.</div>
                <h4 className="serif text-lg mb-2 text-brand-900 font-medium tracking-wide">视觉聚焦：艺术墙画点睛之笔</h4>
                <p className="text-brand-500 text-[12px] font-light leading-relaxed">
                  电视背景或主卧床头，甄选独家定制的艺术墙画作为视觉首焦。配合 1784 种纯色漆色库进行同频调色，底色与主景严丝合缝，确保全屋色彩高度统一。
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.6} direction="up">
              <div className="border-t border-brand-sep pt-6">
                <div className="text-brand-gold font-serif text-3xl italic opacity-50 mb-4 transition-opacity hover:opacity-100">03.</div>
                <h4 className="serif text-lg mb-2 text-brand-900 font-medium tracking-wide">极致收尾：高定窗帘柔和光影</h4>
                <p className="text-brand-500 text-[12px] font-light leading-relaxed">
                  从硬面基底向上延伸，收尾于高定面料的绝美窗帘。垂坠的丝绒棉麻与墙面漆的“蛋壳”漫反射光斑相得益彰，冷暖材质达成隐秘平衡，真正实现所见即所得。
                </p>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-4 auto-rows-[250px] lg:auto-rows-[300px]">
            {/* Main Case */}
            <div className="lg:col-span-8 lg:row-span-2 relative group overflow-hidden rounded-[2px] shadow-sm cursor-pointer">
              <img src="/assets/images/case-living.jpeg" alt="Living Room Case" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-10 left-10 text-white z-10 pr-10">
                <span className="text-[10px] tracking-widest text-brand-gold uppercase font-bold mb-3 block">Premium Living Room</span>
                <h3 className="text-3xl font-serif mb-2">客餐厅全案标杆</h3>
                <p className="text-white/80 text-sm font-light">豪华肌理无缝墙布搭配同频高级灰窗帘，空间尽显德系极简风范。</p>
                <div className="mt-4 flex gap-3 text-[10px] font-medium tracking-wider">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-[2px] shadow-sm">无缝墙布</span>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-[2px] shadow-sm">定制窗帘</span>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-[2px] shadow-sm">纯色墙漆背景</span>
                </div>
              </div>
            </div>

            {/* Sub Case 1 */}
            <div className="lg:col-span-4 lg:row-span-1 relative group overflow-hidden rounded-[2px] shadow-sm cursor-pointer">
              <img src="/assets/images/case-bedroom.jpeg" alt="Bedroom Case" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white z-10 pr-6">
                <h3 className="text-xl font-serif mb-1">主卧艺术视觉点</h3>
                <p className="text-white/80 text-[11px] font-light tracking-wide mt-1">定制艺术墙画与拾光纯色漆色号完美统一。</p>
                <div className="mt-3 flex gap-2 text-[9px] font-medium tracking-wider">
                  <span className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-[2px] border border-white/20">艺术墙画</span>
                  <span className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-[2px] border border-white/20">纯色墙漆</span>
                </div>
              </div>
            </div>

            {/* Sub Case 2 */}
            <div className="lg:col-span-4 lg:row-span-1 relative group overflow-hidden rounded-[2px] shadow-sm cursor-pointer border border-brand-sep">
              <img src="/assets/images/case-curtain.jpeg" alt="Curtain Paint Details" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white z-10 pr-6">
                <h3 className="text-xl font-serif mb-1">材质冷暖共振</h3>
                <p className="text-white/80 text-[11px] font-light tracking-wide mt-1">高定棉麻窗帘与蛋壳光漆面漫反射交相辉映。</p>
                <div className="mt-3 flex gap-2 text-[9px] font-medium tracking-wider">
                  <span className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-[2px] border border-white/20">高定布艺</span>
                  <span className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-[2px] border border-white/20">柔光底漆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-32 max-w-7xl mx-auto px-6 flex items-end justify-between border-t border-brand-sep pt-16 pb-12">
          <div>
            <p className="text-[10px] text-brand-400 tracking-tighter uppercase font-medium">DESIGNED BY YULAN CREATIVE LAB</p>
            <p className="text-[9px] text-brand-300 font-medium">COPYRIGHT © 2026 YULAN GROUP ALL RIGHTS RESERVED</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-12 w-px bg-brand-sep" />
            <div className="serif text-4xl italic text-brand-900 font-light tracking-tighter uppercase">拾光</div>
          </div>
        </footer>
      </section>
    </div>
  );
}
