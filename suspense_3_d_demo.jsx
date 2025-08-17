import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// --- Simple 3D scene components (placeholders) ---
function FloatingBox({ position = [0, 0, 0], label = "" }) {
  const ref = useRef();
  useFrame((state, delta) => (ref.current.rotation.y += delta * 0.2));
  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={[1.6, 0.8, 0.2]} />
        <meshStandardMaterial metalness={0.2} roughness={0.7} />
      </mesh>
      {label && (
        <mesh position={[0, 0.6, 0]}>
          <planeGeometry args={[1.8, 0.45]} />
          <meshBasicMaterial toneMapped={false} transparent={true} opacity={0.95} />
        </mesh>
      )}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.4, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial metalness={0.1} roughness={1} />
    </mesh>
  );
}

function LightRig() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight intensity={0.8} position={[5, 10, 5]} />
    </>
  );
}

// --- Dialog / UI data ---
const scenes = {
  start: {
    text: "你和男子A来到小区，眼前有三栋建筑。你们决定走中间那栋楼。",
    choices: [{ t: "继续上楼", to: "lobby" }],
  },
  lobby: {
    text:
      "上楼后，右边是像电影院柜台的前台，左边有一些房间。你发现一间房门前挂着‘咖啡店’的牌子。男子A走向前台询问租房情况。",
    choices: [
      { t: "巡视左边房门", to: "inspect_left" },
      { t: "等男子A回来", to: "wait_for_A" },
    ],
  },
  inspect_left: {
    text:
      "你在左边巡逻，确认了咖啡店的门牌。下楼时你看到楼梯旁有一个立牌，写着这里快要举办活动。",
    choices: [{ t: "下楼离开", to: "downstairs" }],
  },
  wait_for_A: {
    text:
      "你等了一会儿，男子A回来后说他约了朋友吃东西，要先去忙。你们分开行动，他离开后没多久，一个小女孩出现在你面前。她想要找妈妈，请你陪她。",
    choices: [{ t: "陪她找妈妈", to: "with_girl" }, { t: "拒绝离开", to: "refuse_help" }],
  },
  refuse_help: {
    text: "你选择离开。路上的剧情迅速和你无关——游戏结束（线性结局：冷漠留下遗憾）。",
    choices: [{ t: "重新开始", to: "start" }],
  },
  with_girl: {
    text:
      "女孩大约小学一年级，口齿清晰，标准普通话，和你说她来这里是和妈妈还有奶奶一起来的。你心生保护欲，准备陪她。",
    choices: [{ t: "继续前进", to: "walk_along" }],
  },
  walk_along: {
    text:
      "天色渐暗，你们走到一个分叉口。左边是亮着灯的停车场，看起来安全；右边是黑暗的施工工地后方。女孩坚持要走右边。",
    choices: [
      { t: "说服她走左边（安全）", to: "left_parking" },
      { t: "顺她意走右边（主线）", to: "right_construction" },
    ],
  },
  left_parking: {
    text:
      "你走了左边，路上平平淡淡，找到几位住户询问，也没有发现女孩的母亲。最后你把女孩安全送回，故事平静结束（‘安全但遗憾’结局）。",
    choices: [{ t: "重新开始", to: "start" }],
  },
  right_construction: {
    text:
      "你们从工地后方绕到前方，路过热闹的大排档。男子A正在和两个外国人吃烧烤。你联想到二楼的咖啡店，决定加快脚步回去。",
    choices: [{ t: "赶回二楼咖啡店", to: "back_to_cafe" }],
  },
  back_to_cafe: {
    text:
      "二楼正在举行活动，广播提醒没有票者离场。你拖着女孩下楼，外面突然下起了大雨。广场上人群四散，突然传来疯狗暴走的喧嚣。",
    choices: [{ t: "冲向咖啡店门口", to: "cafe_entrance" }],
  },
  cafe_entrance: {
    text:
      "你带着女孩来到咖啡店门前。女孩看到咖啡店激动寻找妈妈。广播继续，活动人群慌乱。雨更大了。",
    choices: [{ t: "留在门口继续找", to: "look_for_mom" }],
  },
  look_for_mom: {
    text:
      "就在这时，一只疯狗袭向广场，人群四散，狗扑向小女孩，咬伤了她的腿。你愤怒爆发，踢死了疯狗。女孩流血，事件结束——游戏结局（悲剧/救赎并存）。",
    choices: [{ t: "重新开始", to: "start" }],
  },
};

// --- Main App ---
export default function SuspenseDemo() {
  const [sceneKey, setSceneKey] = useState("start");
  const [log, setLog] = useState([]);

  useEffect(() => {
    // push current scene text to log
    setLog((l) => [...l, { key: sceneKey, text: scenes[sceneKey].text }]);
  }, [sceneKey]);

  const choose = (to) => {
    setSceneKey(to);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0b1020] text-white">
      <div className="flex-1 grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2 rounded-lg overflow-hidden bg-[#0f1724] shadow-lg">
          <Canvas camera={{ position: [0, 3, 6], fov: 50 }}>
            <LightRig />
            <Ground />

            {/* simple city layout placeholders */}
            <FloatingBox position={[-2, 1, -1.5]} label="楼1" />
            <FloatingBox position={[0, 1, -1.5]} label="中间楼（楼梯）" />
            <FloatingBox position={[2, 1, -1.5]} label="楼3" />

            {/* little props for lobby */}
            <mesh position={[0.8, 0.2, -0.5]}> 
              <boxGeometry args={[0.8, 0.5, 0.4]} />
              <meshStandardMaterial />
            </mesh>

            {/* camera-orbit helper (subtle) */}
          </Canvas>
        </div>

        <div className="col-span-1 flex flex-col bg-[#071025] rounded-lg p-3 shadow-lg">
          <div className="flex-1 overflow-auto mb-3 text-sm">
            <h3 className="text-lg font-semibold mb-2">剧情日志</h3>
            {log.map((entry, i) => (
              <div key={i} className="mb-2 p-2 rounded bg-[#0b1630]">
                <div className="text-xs opacity-80">{entry.key}</div>
                <div>{entry.text}</div>
              </div>
            ))}
          </div>

          <div className="p-2 bg-[#051226] rounded">
            <div className="mb-2 text-sm">当前场景： <strong>{sceneKey}</strong></div>
            <div className="mb-4 text-sm">{scenes[sceneKey].text}</div>
            <div className="flex flex-wrap gap-2">
              {scenes[sceneKey].choices.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => choose(c.to)}
                  className="px-3 py-2 rounded bg-gradient-to-tr from-[#334155] to-[#0f1724] hover:from-[#2b6cb0]"
                >
                  {c.t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-[#020617] text-xs text-gray-300 flex justify-between">
        <div>悬疑·互动小说 Demo — 3D 背景占位（可扩展）</div>
        <div>提示：此为原型，你可以要求我把场景替换为贴图、添加音效或分支存档。</div>
      </div>
    </div>
  );
}
