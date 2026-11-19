let I={click(){},chime(){},alarm(){},modeSwitch(){}};const b={click(e){I.click(e)},chime(){I.chime()},alarm(){I.alarm()},modeSwitch(){I.modeSwitch()}};function j(e){e&&(I=e)}const L={modeBit:1,currentInstruction:"IDLE",status:"Process running in User Space (Ring 3)",history:[],init(){this.modeBit=1,this.currentInstruction="IDLE",this.status="Process running in User Space (Ring 3). Mode Bit = 1.",this.history=["CPU initialized: Mode Bit = 1 (User Mode). Ready to dispatch instructions."],this.render()},executeUser(){this.modeBit=1,this.currentInstruction="ADD R1, #1",this.status="✓ User instruction executed safely in Ring 3. Mode Bit remains 1.",this.history.unshift(`[USER] Executed '${this.currentInstruction}' -> Mode Bit = 1 (No trap)`),b.click(),this.render()},executeHLT(){this.currentInstruction="HLT (Halt CPU)",this.history.unshift("[VIOLATION] Attempted 'HLT' in User Mode (Mode Bit = 1)!"),this.triggerTrap("General Protection Fault (0x0D)","HLT is a privileged instruction. Hardware raised Trap #13. CPU switched Mode Bit 1 -> 0, vectored to IVT[0x0D], killed illegal process.")},executeCLI(){this.currentInstruction="CLI (Clear Interrupt Flag)",this.history.unshift("[VIOLATION] Attempted 'CLI' in User Mode (Mode Bit = 1)!"),this.triggerTrap("Privileged Instruction Trap (0x0D)","Modifying interrupt flags is strictly privileged. Hardware trapped to kernel. Mode Bit flipped 1 -> 0.")},executeSyscall(){this.currentInstruction="INT 0x80 (sys_read)",this.modeBit=0,this.status="⚡ SYSTEM CALL TRAP: CPU transitioned to Kernel Mode (Mode Bit = 0). IVT[0x80] executed kernel service routine, then IRET flipped Mode Bit back to 1.",this.history.unshift("[SYSCALL] INT 0x80 invoked -> Mode Bit: 1 -> 0 (Kernel) -> Service Routine -> IRET -> 0 -> 1 (User)"),b.chime(),this.render()},executeTimer(){this.currentInstruction="TIMER_IRQ (Hardware Tick)",this.modeBit=0,this.status="⏱️ HARDWARE INTERRUPT: Timer decremented quantum to 0. Mode Bit switched 1 -> 0. Scheduler saved PCB context, selected next process, switched 0 -> 1.",this.history.unshift("[IRQ] Timer tick fired -> Mode Bit: 1 -> 0 -> Context Switch -> 0 -> 1"),b.click(600),this.render()},triggerTrap(e,t){this.modeBit=0,this.status=`⚠️ TRAP EXCEPTION: ${e} triggered! ${t}`,b.alarm(),this.render()},render(){const e=document.getElementById("w0-canvas");if(!e)return;const t=this.modeBit===0;e.innerHTML=`
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 14px;">
          <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.4); border: 1.5px solid ${t?"var(--color-crimson)":"var(--color-cyan)"};">
            <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase;">CPU Hardware Register: Mode Bit</div>
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
              <span style="font-family: var(--font-mono); font-size: 28px; font-weight: 800; color: ${t?"var(--color-crimson)":"var(--color-cyan)"};">${this.modeBit}</span>
              <div>
                <strong style="color: ${t?"var(--color-crimson)":"var(--color-cyan)"}; font-size: 13px;">${t?"RING 0 : KERNEL MODE":"RING 3 : USER MODE"}</strong>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${t?"All privileged hardware instructions unlocked":"Restricted execution; direct hardware access forbidden"}</div>
              </div>
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: var(--text-secondary);">
              Current Instruction: <code style="color: #fff; background: rgba(255,255,255,0.06); padding: 2px 6px;">${this.currentInstruction}</code>
            </div>
          </div>

          <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.4); border: 1px solid var(--border-trace);">
            <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--color-amber); text-transform: uppercase;">Dual-Mode Transition State</div>
            <div style="margin-top: 8px; font-size: 12px; line-height: 1.5; color: var(--text-primary);">${this.status}</div>
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 6px; font-size: 10px; font-family: var(--font-mono);">
              <span class="brand-badge" style="border-color: ${t?"var(--text-muted)":"var(--color-cyan)"}; color: ${t?"var(--text-muted)":"var(--color-cyan)"};">USER SPACE (1)</span>
              <span>&harr; [TRAP / SYSCALL] &harr;</span>
              <span class="brand-badge" style="border-color: ${t?"var(--color-crimson)":"var(--text-muted)"}; color: ${t?"var(--color-crimson)":"var(--text-muted)"};">KERNEL SPACE (0)</span>
            </div>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.6); border: 1px solid var(--border-trace); border-radius: 4px; padding: 10px 14px; font-family: var(--font-mono); font-size: 11px; max-height: 110px; overflow-y: auto;">
          <div style="color: var(--color-copper); font-weight: 700; margin-bottom: 6px; font-size: 9.5px; text-transform: uppercase;">Hardware Event Vector Log:</div>
          ${this.history.map(a=>`<div style="margin-bottom: 3px; color: ${a.includes("VIOLATION")?"var(--color-crimson)":a.includes("SYSCALL")?"var(--color-cyan)":"var(--text-secondary)"};">${a}</div>`).join("")}
        </div>
      </div>
    `}},F={conditions:{mutualExclusion:!0,holdAndWait:!0,noPreemption:!0,circularWait:!0},init(){this.render()},toggle(e){this.conditions[e]=!this.conditions[e],this.render(),b.click()},render(){const e=document.getElementById("w11-canvas");if(!e)return;const t=this.conditions,a=t.mutualExclusion&&t.holdAndWait&&t.noPreemption&&t.circularWait;e.innerHTML=`
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-trace);">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-cyan); margin-bottom: 8px;">THE 4 COFFMAN CONDITIONS (ALL 4 REQUIRED SIMULTANEOUSLY FOR DEADLOCK):</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 10px;">
            <button class="btn-industrial ${t.mutualExclusion?"danger":""}" onclick="W11_CoffmanRAG.toggle('mutualExclusion')" style="justify-content: space-between; padding: 10px 14px;">
              <span>1. Mutual Exclusion</span>
              <strong>${t.mutualExclusion?"⚠️ ACTIVE (Locked)":"✓ SPOOLED/SHARED"}</strong>
            </button>
            <button class="btn-industrial ${t.holdAndWait?"danger":""}" onclick="W11_CoffmanRAG.toggle('holdAndWait')" style="justify-content: space-between; padding: 10px 14px;">
              <span>2. Hold and Wait</span>
              <strong>${t.holdAndWait?"⚠️ ACTIVE (Holding)":"✓ ALLOCATE ALL AT ONCE"}</strong>
            </button>
            <button class="btn-industrial ${t.noPreemption?"danger":""}" onclick="W11_CoffmanRAG.toggle('noPreemption')" style="justify-content: space-between; padding: 10px 14px;">
              <span>3. No Preemption</span>
              <strong>${t.noPreemption?"⚠️ ACTIVE (No steal)":"✓ PREEMPT RESOURCES"}</strong>
            </button>
            <button class="btn-industrial ${t.circularWait?"danger":""}" onclick="W11_CoffmanRAG.toggle('circularWait')" style="justify-content: space-between; padding: 10px 14px;">
              <span>4. Circular Wait</span>
              <strong>${t.circularWait?"⚠️ ACTIVE (Cycle P0->R1->P1->R0)":"✓ STRICT RESOURCE ORDERING"}</strong>
            </button>
          </div>
        </div>

        <div class="panel-chamfer" style="padding: 14px; background: ${a?"rgba(255,42,84,0.1)":"rgba(0,255,163,0.08)"}; border: 1.5px solid ${a?"var(--color-crimson)":"var(--color-emerald)"};">
          <div style="font-weight: 700; font-size: 13px; color: ${a?"var(--color-crimson)":"var(--color-emerald)"};">
            ${a?"🚨 FATAL DEADLOCK DETECTED! All 4 Coffman conditions hold.":"🛡️ SYSTEM DEADLOCK-FREE! Deadlock prevented by breaking at least one Coffman condition."}
          </div>
          <div style="margin-top: 6px; font-size: 12px; color: var(--text-primary); line-height: 1.5;">
            ${a?"A circular dependency cycle has formed between processes P0, P1 and resources R0, R1. Neither process can proceed, causing indefinite freezing.":"Havender Prevention Protocol: By breaking one condition, a circular chain cannot form, mathematically guaranteeing zero deadlocks."}
          </div>
        </div>
      </div>
    `}},W={cycle:["P1","P2","P3"],victim:null,recovered:!1,init(){this.victim=null,this.recovered=!1,this.render()},terminateVictim(e){this.victim=e,this.recovered=!0,b.chime(),this.render()},render(){const e=document.getElementById("w12-recovery-canvas");e&&(e.innerHTML=`
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-trace);">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-cyan); margin-bottom: 8px;">WAIT-FOR GRAPH CYCLE DETECTION:</div>
          <div style="font-family: var(--font-mono); font-size: 12px; color: ${this.recovered?"var(--color-emerald)":"var(--color-crimson)"};">
            ${this.recovered?`✓ Cycle broken! Terminated victim ${this.victim} and reclaimed resources.`:"⚠️ Directed Cycle Detected: P1 &rarr; P2 &rarr; P3 &rarr; P1 (Deadlock)"}
          </div>
        </div>

        <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-trace);">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-amber); margin-bottom: 8px;">VICTIM SELECTION BY RECOVERY COST (SILBERSCHATZ §8.8):</div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-industrial ${this.victim==="P1"?"primary":""}" onclick="W12_DeadlockRecovery.terminateVictim('P1')">Abort P1 (Priority 8, Cost: 40ms)</button>
            <button class="btn-industrial ${this.victim==="P2"?"primary":""}" onclick="W12_DeadlockRecovery.terminateVictim('P2')">Abort P2 (Priority 2, Lowest Cost: 10ms - Optimal!)</button>
            <button class="btn-industrial ${this.victim==="P3"?"primary":""}" onclick="W12_DeadlockRecovery.terminateVictim('P3')">Abort P3 (Priority 5, Cost: 25ms)</button>
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: var(--text-secondary);">
            ${this.recovered?`<strong style="color:var(--color-emerald)">Recovery Action:</strong> Process ${this.victim} aborted. Held resource allocation returned to Available pool. Remaining processes resumed.`:"Select a victim process to abort or rollback to safe checkpoint."}
          </div>
        </div>
      </div>
    `)}},N={fileSizeKB:96,blockSizeKB:4,init(){this.render()},setFileSize(e){this.fileSizeKB=Math.max(1,Math.min(32768,parseInt(e,10)||4)),this.render()},setBlockSize(e){this.blockSizeKB=Math.max(1,parseInt(e,10)||4),this.render()},render(){const e=document.getElementById("w17-canvas");if(!e)return;const t=this.blockSizeKB,a=t*1024/4,i=Math.ceil(this.fileSizeKB/t),d=12,s=Math.min(i,d),c=Math.max(0,i-d),u=Math.min(c,a),n=Math.max(0,c-a),o=(u>0?1:0)+(n>0?1+Math.ceil(n/a):0);e.innerHTML=`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="play-controls-bar">
          <div class="play-ctrl">
            <label>File Size (KB):</label>
            <input type="range" class="play-range" min="4" max="8192" step="4" value="${Math.min(8192,this.fileSizeKB)}" oninput="W17_InodeFileSystem.setFileSize(this.value)" />
            <input type="number" class="play-num" min="1" max="32768" value="${this.fileSizeKB}" oninput="W17_InodeFileSystem.setFileSize(this.value)" />
          </div>
          <div class="play-ctrl">
            <label>Block Size:</label>
            <select class="play-num" style="width:92px;" onchange="W17_InodeFileSystem.setBlockSize(this.value)">
              <option value="1" ${t===1?"selected":""}>1 KB</option>
              <option value="2" ${t===2?"selected":""}>2 KB</option>
              <option value="4" ${t===4?"selected":""}>4 KB</option>
              <option value="8" ${t===8?"selected":""}>8 KB</option>
            </select>
          </div>
          <button class="btn-industrial ${this.fileSizeKB===16?"primary":""}" onclick="W17_InodeFileSystem.setFileSize(16)">16 KB</button>
          <button class="btn-industrial ${this.fileSizeKB===44?"primary":""}" onclick="W17_InodeFileSystem.setFileSize(44)">44 KB (Direct)</button>
          <button class="btn-industrial ${this.fileSizeKB===96?"primary":""}" onclick="W17_InodeFileSystem.setFileSize(96)">96 KB (Single Ind.)</button>
          <button class="btn-industrial ${this.fileSizeKB===5e3?"primary":""}" onclick="W17_InodeFileSystem.setFileSize(5000)">5000 KB (Double Ind.)</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px;">
          <div style="padding: 10px; background: var(--primary-glow); border: 1px solid var(--color-cyan); border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: var(--color-cyan);">12 DIRECT POINTERS</div>
            <div style="font-size: 12px; margin-top: 4px; color: var(--text-primary);">Used: <strong>${s}</strong> / 12 blocks</div>
            <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">Capacity &le; ${12*t} KB (1 disk read)</div>
          </div>
          <div style="padding: 10px; background: ${u>0?"var(--warning-bg)":"var(--bg-card)"}; border: 1px solid ${u>0?"var(--color-amber)":"var(--border)"}; border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: var(--color-amber);">SINGLE INDIRECT POINTER</div>
            <div style="font-size: 12px; margin-top: 4px; color: var(--text-primary);">Used: <strong>${u}</strong> / ${a} ptrs</div>
            <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">+${a*t} KB (2 disk reads)</div>
          </div>
          <div style="padding: 10px; background: ${n>0?"var(--danger-bg)":"var(--bg-card)"}; border: 1px solid ${n>0?"var(--color-crimson)":"var(--border)"}; border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: ${n>0?"var(--color-crimson)":"var(--text-secondary)"};">DOUBLE INDIRECT POINTER</div>
            <div style="font-size: 12px; margin-top: 4px; color: var(--text-primary);">Used: <strong>${n}</strong> blocks</div>
            <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">Needs 3 disk reads per access</div>
          </div>
        </div>

        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Exam Workings (As Written By Hand)</span><span>4-Byte Pointer Assumption</span></div>
          <span class="hw-step">1) Data Blocks = &lceil; File Size / Block Size &rceil; = &lceil; ${this.fileSizeKB} / ${t} &rceil; = <span class="hw-sub">${i} blocks</span></span>
          <span class="hw-step">2) Pointers per Index Block = (${t} &times; 1024 B) / 4 B = <span class="hw-sub">${a} pointers/block</span></span>
          <span class="hw-step">3) Breakdown: 12 Direct (${s} used) &rarr; Remaining = max(0, ${i} &minus; 12) = <span class="hw-sub">${c}</span></span>
          <span class="hw-step">   Single Indirect covers up to ${a} blocks (${u} used) &rarr; Double Indirect: <span class="hw-sub">${n} blocks</span></span>
          <span class="hw-step">4) Index Overhead = <span class="hw-sub">${o} index block(s)</span> | Total Allocated Disk Blocks = ${i} + ${o} = <span class="hw-ans">${i+o} blocks</span></span>
        </div>
      </div>
    `}},_={mode:"DMA",transferKB:4,irqCostCycles:120,init(){this.render()},setMode(e){this.mode=e,this.render(),b.click()},setTransferKB(e){this.transferKB=Math.max(1,Math.min(256,parseInt(e,10)||4)),this.render()},setIrqCost(e){this.irqCostCycles=Math.max(10,Math.min(1e3,parseInt(e,10)||120)),this.render()},render(){const e=document.getElementById("w18-canvas");if(!e)return;const t=this.mode,a=this.transferKB*1024,i=a,d=1,s=i*this.irqCostCycles,c=d*this.irqCostCycles,u=(s/c).toLocaleString();e.innerHTML=`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="play-controls-bar">
          <div class="play-ctrl">
            <label>Block Size (KB):</label>
            <input type="range" class="play-range" min="1" max="64" value="${this.transferKB}" oninput="W18_IODMAModel.setTransferKB(this.value)" />
            <input type="number" class="play-num" min="1" max="256" value="${this.transferKB}" oninput="W18_IODMAModel.setTransferKB(this.value)" />
          </div>
          <div class="play-ctrl">
            <label>ISR Overhead (cycles):</label>
            <input type="range" class="play-range" min="20" max="500" step="10" value="${this.irqCostCycles}" oninput="W18_IODMAModel.setIrqCost(this.value)" />
            <input type="number" class="play-num" min="10" max="1000" value="${this.irqCostCycles}" oninput="W18_IODMAModel.setIrqCost(this.value)" />
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn-industrial ${t==="Polling"?"danger":""}" onclick="W18_IODMAModel.setMode('Polling')">1. Programmed I/O (Polling)</button>
          <button class="btn-industrial ${t==="Interrupt"?"primary":""}" onclick="W18_IODMAModel.setMode('Interrupt')">2. Interrupt-Driven I/O</button>
          <button class="btn-industrial ${t==="DMA"?"primary":""}" onclick="W18_IODMAModel.setMode('DMA')">3. Direct Memory Access (DMA)</button>
        </div>

        <div class="panel-chamfer" style="padding: 14px; background: var(--bg-panel); border: 1.5px solid ${t==="DMA"?"var(--color-emerald)":t==="Interrupt"?"var(--color-cyan)":"var(--color-crimson)"};">
          <div style="font-size: 12px; font-weight: 700; color: ${t==="DMA"?"var(--color-emerald)":t==="Interrupt"?"var(--color-cyan)":"var(--color-crimson)"}; text-transform: uppercase;">
            ${t==="Polling"?"POLLING (BUSY-WAITING) MODEL":t==="Interrupt"?"INTERRUPT-DRIVEN I/O MODEL":"DIRECT MEMORY ACCESS (DMA) BLOCK TRANSFER MODEL"}
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: var(--text-primary); line-height: 1.55;">
            ${t==="Polling"?"<strong>CPU Waste:</strong> CPU executes <code>while (device->busy);</code> polling status register every cycle. Zero interrupts, but 100% CPU wasted waiting.":t==="Interrupt"?"<strong>Byte-by-Byte Interrupts:</strong> CPU gets interrupted after every single byte transferred over I/O bus — massive context-switch thrashing for fast disks/NICs.":"<strong>Block Bypass:</strong> CPU programs DMA Controller (src, dst, count) once, then runs another process. DMA writes entire block directly into RAM using cycle-stealing, raising only <strong>1 interrupt at completion</strong>."}
          </div>
        </div>

        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Exam Overhead Comparison (As Written By Hand)</span><span>${this.transferKB} KB Transfer</span></div>
          <span class="hw-step">Transfer Bytes = ${this.transferKB} KB &times; 1024 = <span class="hw-sub">${a.toLocaleString()} bytes</span></span>
          <span class="hw-step">&bull; Interrupt-Driven (1 IRQ/byte) = ${a.toLocaleString()} &times; ${this.irqCostCycles} cycles = <span class="hw-warn">${s.toLocaleString()} CPU cycles lost</span></span>
          <span class="hw-step">&bull; DMA (1 IRQ/block) = 1 &times; ${this.irqCostCycles} cycles = <span class="hw-ans">${c.toLocaleString()} CPU cycles lost (${u}&times; fewer IRQs!)</span></span>
        </div>
      </div>
    `}},z={currentDomain:"D1",testObject:"File 1",testRight:"W",matrix:{D1:{"File 1":"R*, W","File 2":"R",Printer:"-"},D2:{"File 1":"-","File 2":"R, W, owner",Printer:"Print"},D3:{"File 1":"R","File 2":"-",Printer:"Print"}},init(){this.render()},switchDomain(e){this.currentDomain=e,this.render(),b.click()},setCheck(e,t){e&&(this.testObject=e),t&&(this.testRight=t),this.render(),b.click(900)},render(){const e=document.getElementById("w19-canvas");if(!e)return;const t=this.matrix[this.currentDomain]&&this.matrix[this.currentDomain][this.testObject]||"-",a=t.split(",").some(i=>i.trim().replace("*","").toLowerCase()===this.testRight.toLowerCase());e.innerHTML=`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <label style="font-size: 11px; font-weight: 700; color: var(--color-cyan);">ACTIVE DOMAIN:</label>
          <button class="btn-industrial ${this.currentDomain==="D1"?"primary":""}" onclick="W19_AccessMatrix.switchDomain('D1')">D1 (User App)</button>
          <button class="btn-industrial ${this.currentDomain==="D2"?"primary":""}" onclick="W19_AccessMatrix.switchDomain('D2')">D2 (Spooler)</button>
          <button class="btn-industrial ${this.currentDomain==="D3"?"primary":""}" onclick="W19_AccessMatrix.switchDomain('D3')">D3 (Auditor)</button>
        </div>

        <div class="play-controls-bar">
          <div class="play-ctrl">
            <label>Test Object:</label>
            <select class="play-num" style="width:105px;" onchange="W19_AccessMatrix.setCheck(this.value, null)">
              <option value="File 1" ${this.testObject==="File 1"?"selected":""}>File 1</option>
              <option value="File 2" ${this.testObject==="File 2"?"selected":""}>File 2</option>
              <option value="Printer" ${this.testObject==="Printer"?"selected":""}>Printer</option>
            </select>
          </div>
          <div class="play-ctrl">
            <label>Requested Op:</label>
            <select class="play-num" style="width:92px;" onchange="W19_AccessMatrix.setCheck(null, this.value)">
              <option value="R" ${this.testRight==="R"?"selected":""}>R (Read)</option>
              <option value="W" ${this.testRight==="W"?"selected":""}>W (Write)</option>
              <option value="Print" ${this.testRight==="Print"?"selected":""}>Print</option>
            </select>
          </div>
          <span class="nav-badge" style="background:${a?"var(--success-bg)":"var(--danger-bg)"}; color:${a?"var(--color-emerald)":"var(--color-crimson)"}; border-color:${a?"var(--color-emerald)":"var(--color-crimson)"};">
            ${a?"✓ ACCESS GRANTED":"✕ TRAP: ACCESS DENIED"}
          </span>
        </div>

        <table class="data-table">
          <thead>
            <tr><th>Domain (Row = Capability)</th><th>Object: File 1</th><th>Object: File 2</th><th>Object: Printer</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${Object.keys(this.matrix).map(i=>`
              <tr style="${i===this.currentDomain?"background: var(--primary-glow); border-left: 3px solid var(--color-cyan);":""}">
                <td><strong>${i}</strong> ${i===this.currentDomain?"(ACTIVE)":""}</td>
                <td><code>${this.matrix[i]["File 1"]}</code></td>
                <td><code>${this.matrix[i]["File 2"]}</code></td>
                <td><code>${this.matrix[i].Printer}</code></td>
                <td>${i===this.currentDomain?'<span style="color:var(--color-cyan); font-weight:700;">ACTIVE PRIVILEGES</span>':'<span style="color:var(--text-muted)">Dormant</span>'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Access Lookup &amp; Implementation Split</span><span>M[Domain, Object]</span></div>
          <span class="hw-step">Lookup M[${this.currentDomain}, ${this.testObject}] = { <span class="hw-sub">${t}</span> }</span>
          <span class="hw-step">Is requested operation '${this.testRight}' &isin; M[${this.currentDomain}, ${this.testObject}]? &rarr; <span class="${a?"hw-ans":"hw-warn"}">${a?"YES &rarr; GRANTED":"NO &rarr; PROTECTION FAULT"}</span></span>
          <span class="hw-step"><span class="hw-dim">Rule: Copy flag (*) allows vertical copy inside same column; ACL = column slice per object; Capability List = row slice per domain.</span></span>
        </div>
      </div>
    `}},H={currentState:"New",states:["New","Ready","Running","Waiting","Terminated"],transitions:{New:[{to:"Ready",action:"Admit",desc:"Long-term scheduler admits process to ready queue."}],Ready:[{to:"Running",action:"Dispatch",desc:"Short-term scheduler selects process to execute."}],Running:[{to:"Ready",action:"Interrupt / Timeout",desc:"Timer interrupt expired or higher-priority process arrived."},{to:"Waiting",action:"I/O or Event Wait",desc:"Process requested I/O or is waiting for an event/signal."},{to:"Terminated",action:"Exit",desc:"Process finished execution or encountered a fatal error."}],Waiting:[{to:"Ready",action:"I/O Completion",desc:"I/O operation completed; moved back to ready queue."}],Terminated:[{to:"New",action:"Reset New Process",desc:"Spawn a new process."}]},init(){this.render()},trigger(e){const t=(this.transitions[this.currentState]||[]).find(i=>i.action===e),a=document.getElementById("w1-narr");t?(this.currentState=t.to,a&&(a.innerHTML=`<strong>Action: ${t.action}</strong> &rarr; Moved to state <strong>${t.to}</strong>. <br><span style="color:var(--text-secondary)">${t.desc}</span>`),b.click(960),this.render()):(a&&(a.innerHTML=`<span style="color:var(--color-crimson)">⚠️ Invalid transition! Cannot perform '${e}' from '${this.currentState}'.</span>`),b.alarm())},render(){const e=document.getElementById("w1-canvas"),t=document.getElementById("w1-actions");if(!e)return;const a=this.currentState,i=(d,s,c,u,l)=>{const n=a===l,o=n?"var(--primary)":"var(--bg-panel-elevated)",r=n?"var(--color-amber)":"var(--color-cyan)",p=n?"var(--on-primary)":"var(--text-primary)";return`
        <rect x="${d}" y="${s}" width="${c}" height="${u}" rx="20" fill="${o}" stroke="${r}" stroke-width="${n?"3":"1.8"}" />
        <text x="${d+c/2}" y="${s+u/2+5}" fill="${p}" font-weight="800" text-anchor="middle" font-size="13.5" font-family="var(--font-mono)">${l}</text>
      `};if(e.innerHTML=`
      <svg viewBox="0 0 700 245" style="width:100%; max-width:660px; display:block;">
        <defs>
          <marker id="w1-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-cyan)" />
          </marker>
        </defs>

        <!-- New State -->
        ${i(18,92,92,44,"New")}

        <!-- New -> Ready -->
        <path d="M 110 114 L 176 114" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="143" y="102" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">Admit</text>

        <!-- Ready State -->
        ${i(182,92,100,44,"Ready")}

        <!-- Ready -> Running -->
        <path d="M 282 114 L 358 114" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="320" y="102" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">Dispatch</text>

        <!-- Running State -->
        ${i(364,92,112,44,"Running")}

        <!-- Running -> Ready (Interrupt) -->
        <path d="M 405 92 C 365 36, 275 36, 240 88" fill="none" stroke="var(--color-amber)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="320" y="34" fill="var(--color-amber)" font-size="11" font-weight="600" text-anchor="middle">Interrupt / Quantum Expired</text>

        <!-- Waiting State -->
        ${i(270,184,110,44,"Waiting")}

        <!-- Running -> Waiting -->
        <path d="M 418 136 C 418 172, 398 196, 384 202" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="456" y="176" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">I/O Wait</text>

        <!-- Waiting -> Ready -->
        <path d="M 270 202 C 232 194, 218 170, 222 140" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="190" y="180" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">I/O Done</text>

        <!-- Running -> Terminated -->
        <path d="M 476 114 L 542 114" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="509" y="102" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">Exit</text>

        <!-- Terminated State -->
        ${i(548,92,128,44,"Terminated")}
      </svg>
    `,t){const d=this.transitions[this.currentState]||[];t.innerHTML=d.map(s=>`
        <button class="btn-industrial primary" onclick="W1_StateMachine.trigger('${s.action}')">${s.action}</button>
      `).join(" ")}}},M={nForks:3,init(){this.render()},update(e){this.nForks=Math.max(1,Math.min(5,parseInt(e,10)||1));const t=document.getElementById("w2-range"),a=document.getElementById("w2-num");t&&t.value!=this.nForks&&(t.value=this.nForks),a&&a.value!=this.nForks&&(a.value=this.nForks),this.render()},render(){const e=document.getElementById("w2-canvas"),t=document.getElementById("w2-stats"),a=document.getElementById("w2-hand");if(!e)return;const i=Math.pow(2,this.nForks),d=i-1;t&&(t.innerHTML=`
        <span>Total Processes: <strong style="color:var(--color-cyan)">${i}</strong> (2<sup>${this.nForks}</sup>)</span> &nbsp;|&nbsp;
        <span>Unique Child Processes created: <strong style="color:var(--color-emerald)">${d}</strong> (2<sup>${this.nForks}</sup> &minus; 1)</span>
      `);const s=620,c=56+this.nForks*48;let u=`<svg viewBox="0 0 ${s} ${c}" style="width:100%; max-width:620px; display:block;">`,l=[{x:s/2,y:28,pid:"P0"}];u+='<text x="12" y="32" fill="var(--text-secondary)" font-size="10" font-family="var(--font-mono)">Init</text>';let n="",o=`<circle cx="${s/2}" cy="28" r="14" fill="var(--color-cyan)" stroke="var(--color-amber)" stroke-width="2" />
      <text x="${s/2}" y="32" fill="var(--on-primary)" font-size="10" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">P0</text>`,r=1;for(let p=1;p<=this.nForks;p++){let h=[];const m=28+p*48;u+=`<text x="12" y="${m+4}" fill="var(--text-secondary)" font-size="10" font-family="var(--font-mono)">fork #${p}</text>`;for(let v=0;v<l.length;v++){const f=l[v],g=(s-90)/Math.pow(2,p+1),y=f.x-g,x=f.x+g;n+=`<line x1="${f.x}" y1="${f.y}" x2="${y}" y2="${m}" stroke="var(--border-light)" stroke-width="1.8"/>`,o+=`<circle cx="${y}" cy="${m}" r="12" fill="var(--bg-panel-elevated)" stroke="var(--color-cyan)" stroke-width="1.8"/>`,o+=`<text x="${y}" y="${m+3.5}" fill="var(--text-primary)" font-size="9" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">${f.pid}</text>`;const w=`P${r++}`;n+=`<line x1="${f.x}" y1="${f.y}" x2="${x}" y2="${m}" stroke="var(--color-purple)" stroke-width="2"/>`,o+=`<circle cx="${x}" cy="${m}" r="12" fill="var(--color-purple)" stroke="var(--border-light)" stroke-width="1.2"/>`,o+=`<text x="${x}" y="${m+3.5}" fill="#fff" font-size="9" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">${w}</text>`,h.push({x:y,y:m,pid:f.pid}),h.push({x,y:m,pid:w})}l=h}u+=n+o+"</svg>",e.innerHTML=u,a&&(a.innerHTML=`
        <div class="hw-title"><span>✍️ Exam Derivation (As Written By Hand)</span><span>${this.nForks} sequential fork() calls</span></div>
        <span class="hw-step">Given n = ${this.nForks} fork() calls in sequence (Parent = P0)</span>
        <span class="hw-step">&bull; Total Processes = 2<sup>n</sup> = 2<sup>${this.nForks}</sup> = <span class="hw-ans">${i} processes</span></span>
        <span class="hw-step">&bull; New Child Processes = 2<sup>n</sup> &minus; 1 = ${i} &minus; 1 = <span class="hw-ans">${d} children</span> (P1..P${d})</span>
      `)}},P={sPct:25,cores:4,init(){this.render()},update(e,t){e!=null&&(this.sPct=Math.max(1,Math.min(100,parseFloat(e)||1))),t!=null&&(this.cores=Math.max(1,Math.min(64,parseInt(t,10)||1)));const a=document.getElementById("w2b-s-range"),i=document.getElementById("w2b-s-num"),d=document.getElementById("w2b-n-range"),s=document.getElementById("w2b-n-num");a&&(a.value=this.sPct),i&&(i.value=this.sPct),d&&(d.value=this.cores),s&&(s.value=this.cores),this.render()},render(){const e=document.getElementById("w2b-canvas");if(!e)return;const t=+(this.sPct/100).toFixed(2),a=+(1-t).toFixed(2),i=this.cores,d=a/i,s=t+d,c=1/s,u=t>0?1/t:1/0,l=t/Math.max(.001,s)*100,n=d/Math.max(.001,s)*100;e.innerHTML=`
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="font-size:11px; color:var(--text-secondary);">Normalized Execution Time Ratio (<strong style="color:var(--text-primary)">1.00 &rarr; ${s.toFixed(4)}</strong>):</div>
        <div style="display:flex; height:26px; width:${Math.min(100,s*100).toFixed(1)}%; min-width:95px; border:1px solid var(--border-light); border-radius:4px; overflow:hidden; font-family:var(--font-mono); font-size:10px; font-weight:700;">
          <div style="width:${l.toFixed(1)}%; background:var(--color-crimson); color:#fff; display:flex; align-items:center; justify-content:center;">S=${t.toFixed(2)}</div>
          ${a>0?`<div style="width:${n.toFixed(1)}%; background:var(--color-cyan); color:var(--on-primary); display:flex; align-items:center; justify-content:center;">(1-S)/N=${d.toFixed(3)}</div>`:""}
        </div>
        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Exam Workings (As Written By Hand)</span><span>Serial=${t.toFixed(2)} | Cores=${i}</span></div>
          <span class="hw-step">Speedup &le; 1 / [ S + (1 &minus; S) / N ]</span>
          <span class="hw-step">       = 1 / [ ${t.toFixed(2)} + (1 &minus; ${t.toFixed(2)}) / ${i} ]</span>
          <span class="hw-step">       = 1 / [ ${t.toFixed(2)} + ${a.toFixed(2)} / ${i} ] = 1 / [ ${t.toFixed(2)} + <span class="hw-sub">${d.toFixed(4)}</span> ] = 1 / <span class="hw-sub">${s.toFixed(4)}</span> = <span class="hw-ans">${c.toFixed(2)}&times; Speedup</span></span>
          <span class="hw-step">Asymptotic Ceiling (N &rarr; &infin;): Max Speedup = 1 / S = 1 / ${t.toFixed(2)} = <span class="hw-sub">${Number.isFinite(u)?u.toFixed(2)+"×":"∞"}</span></span>
        </div>
      </div>
    `}},C={algorithm:"FCFS",quantum:4,selectedIdx:0,processes:[{id:"P1",at:0,bt:24,p:3},{id:"P2",at:0,bt:3,p:1},{id:"P3",at:0,bt:3,p:4}],loadExample(e){this.selectedIdx=0,e==="standard"?(this.algorithm=this.algorithm||"FCFS",this.processes=[{id:"P1",at:0,bt:24,p:3},{id:"P2",at:0,bt:3,p:1},{id:"P3",at:0,bt:3,p:4}]):e==="srtf"?(this.algorithm="SRTF",this.processes=[{id:"P1",at:0,bt:8,p:1},{id:"P2",at:1,bt:4,p:1},{id:"P3",at:2,bt:9,p:1},{id:"P4",at:3,bt:5,p:1}]):e==="priority"?(this.algorithm="Priority-Pre",this.processes=[{id:"P1",at:0,bt:10,p:3},{id:"P2",at:0,bt:1,p:1},{id:"P3",at:0,bt:2,p:4},{id:"P4",at:0,bt:1,p:5},{id:"P5",at:0,bt:5,p:2}]):e==="rr"&&(this.algorithm="RR",this.quantum=4,this.processes=[{id:"P1",at:0,bt:24,p:1},{id:"P2",at:0,bt:3,p:1},{id:"P3",at:0,bt:3,p:1}]),this.syncUI(),this.calculate(!1)},addProcess(){if(this.processes.length>=8)return;const e=this.processes.map(a=>parseInt(a.id.replace("P",""),10)||0),t=(e.length?Math.max(...e):0)+1;this.processes.push({id:`P${t}`,at:0,bt:4,p:2}),this.selectedIdx=this.processes.length-1,this.syncUI(),this.calculate(!1),b.click(980)},removeProcess(e){this.processes.length<=1||(this.processes.splice(e,1),this.selectedIdx>=this.processes.length&&(this.selectedIdx=this.processes.length-1),this.syncUI(),this.calculate(!1),b.click(700))},selectProc(e){this.selectedIdx=Math.max(0,Math.min(this.processes.length-1,parseInt(e,10)||0)),this.syncUI()},setQuantum(e){this.quantum=Math.max(1,Math.min(30,parseInt(e,10)||1)),this.syncUI(),this.calculate(!0)},updateProcField(e,t,a,i=!1){const d=this.processes[e];if(!d)return;let s=parseInt(a,10);if(!isNaN(s)){if(t==="bt"?s=Math.max(1,Math.min(60,s)):t==="at"?s=Math.max(0,Math.min(60,s)):t==="p"&&(s=Math.max(1,Math.min(20,s))),d[t]=s,this.selectedIdx=e,i){const c=document.getElementById(`w3-cell-${t}-${e}`);c&&(c.value=s)}this.syncSliderReadouts(),this.calculate(!0)}},syncSliderReadouts(){const e=this.processes[this.selectedIdx]||this.processes[0];if(!e)return;const t=(a,i)=>{const d=document.getElementById(a);d&&d.value!=i&&(d.value=i)};t("w3-sl-at-r",e.at),t("w3-sl-at-n",e.at),t("w3-sl-bt-r",e.bt),t("w3-sl-bt-n",e.bt),t("w3-sl-p-r",e.p),t("w3-sl-p-n",e.p)},syncUI(){const e=document.getElementById("w3-algo"),t=document.getElementById("w3-quantum"),a=document.getElementById("w3-q-ctrl"),i=document.getElementById("w3-q-range");e&&(e.value=this.algorithm),t&&(t.value=this.quantum),i&&(i.value=this.quantum),a&&(a.style.display=this.algorithm==="RR"?"inline-flex":"none");const d=document.getElementById("w3-sl-proc");d&&(d.innerHTML=this.processes.map((s,c)=>`<option value="${c}" ${c===this.selectedIdx?"selected":""}>${s.id}</option>`).join("")),this.syncSliderReadouts()},calculate(e=!1){const t=this.algorithm,a=Math.max(1,parseInt(this.quantum,10)||4),i=this.processes.map((l,n)=>({...l,origIdx:n}));let d=[],s=0,c=0;const u=i.length;if(i.forEach(l=>{l.rem=l.bt,l.ct=0,l.tat=0,l.wt=0,l.rt=-1,l.firstStart=-1}),t==="FCFS")[...i].sort((n,o)=>n.at-o.at||n.origIdx-o.origIdx).forEach(n=>{s<n.at&&(d.push({proc:"Idle",start:s,end:n.at}),s=n.at),n.rt===-1&&(n.rt=s-n.at,n.firstStart=s),d.push({proc:n.id,start:s,end:s+n.bt}),s+=n.bt,n.ct=s,n.tat=n.ct-n.at,n.wt=n.tat-n.bt});else if(t==="SJF"){let l=new Set;for(;c<u;){let n=i.filter(r=>r.at<=s&&!l.has(r.id));if(n.length===0){let r=Math.min(...i.filter(p=>!l.has(p.id)).map(p=>p.at));d.push({proc:"Idle",start:s,end:r}),s=r;continue}n.sort((r,p)=>r.bt-p.bt||r.at-p.at||r.origIdx-p.origIdx);let o=n[0];o.rt===-1&&(o.rt=s-o.at,o.firstStart=s),d.push({proc:o.id,start:s,end:s+o.bt}),s+=o.bt,o.ct=s,o.tat=o.ct-o.at,o.wt=o.tat-o.bt,l.add(o.id),c++}}else if(t==="SRTF"){let l=null,n=0;for(;c<u;){let o=i.filter(p=>p.at<=s&&p.rem>0);if(o.length===0){let p=Math.min(...i.filter(h=>h.rem>0).map(h=>h.at));l&&(d.push({proc:l,start:n,end:s}),l=null),d.push({proc:"Idle",start:s,end:p}),s=p;continue}o.sort((p,h)=>p.rem-h.rem||p.at-h.at||p.origIdx-h.origIdx);let r=o[0];r.rt===-1&&(r.rt=s-r.at,r.firstStart=s),r.id!==l&&(l&&d.push({proc:l,start:n,end:s}),l=r.id,n=s),r.rem--,s++,r.rem===0&&(d.push({proc:r.id,start:n,end:s}),l=null,r.ct=s,r.tat=r.ct-r.at,r.wt=r.tat-r.bt,c++)}}else if(t==="Priority-NonPre"){let l=new Set;for(;c<u;){let n=i.filter(r=>r.at<=s&&!l.has(r.id));if(n.length===0){let r=Math.min(...i.filter(p=>!l.has(p.id)).map(p=>p.at));d.push({proc:"Idle",start:s,end:r}),s=r;continue}n.sort((r,p)=>r.p-p.p||r.at-p.at||r.origIdx-p.origIdx);let o=n[0];o.rt===-1&&(o.rt=s-o.at,o.firstStart=s),d.push({proc:o.id,start:s,end:s+o.bt}),s+=o.bt,o.ct=s,o.tat=o.ct-o.at,o.wt=o.tat-o.bt,l.add(o.id),c++}}else if(t==="Priority-Pre"){let l=null,n=0;for(;c<u;){let o=i.filter(p=>p.at<=s&&p.rem>0);if(o.length===0){let p=Math.min(...i.filter(h=>h.rem>0).map(h=>h.at));l&&(d.push({proc:l,start:n,end:s}),l=null),d.push({proc:"Idle",start:s,end:p}),s=p;continue}o.sort((p,h)=>p.p-h.p||p.at-h.at||p.origIdx-h.origIdx);let r=o[0];r.rt===-1&&(r.rt=s-r.at,r.firstStart=s),r.id!==l&&(l&&d.push({proc:l,start:n,end:s}),l=r.id,n=s),r.rem--,s++,r.rem===0&&(d.push({proc:r.id,start:n,end:s}),l=null,r.ct=s,r.tat=r.ct-r.at,r.wt=r.tat-r.bt,c++)}}else if(t==="RR"){let l=[],n=new Set,o=[...i].sort((p,h)=>p.at-h.at||p.origIdx-h.origIdx),r=p=>{o.forEach(h=>{h.at<=p&&!n.has(h.id)&&h.rem>0&&(l.push(h),n.add(h.id))})};for(r(s);c<u;){if(l.length===0){let m=Math.min(...i.filter(v=>v.rem>0).map(v=>v.at));d.push({proc:"Idle",start:s,end:m}),s=m,r(s);continue}let p=l.shift();n.delete(p.id),p.rt===-1&&(p.rt=s-p.at,p.firstStart=s);let h=Math.min(a,p.rem);d.push({proc:p.id,start:s,end:s+h}),s+=h,p.rem-=h,r(s),p.rem===0?(p.ct=s,p.tat=p.ct-p.at,p.wt=p.tat-p.bt,c++):(l.push(p),n.add(p.id))}}this.renderGantt(d),this.renderTable(i,d,e)},renderGantt(e){const t=document.getElementById("w3-gantt");if(!t)return;if(e.length===0){t.innerHTML='<p style="color:var(--text-secondary);">No timeline generated.</p>';return}const a=e[e.length-1].end,i=760,d=i/Math.max(1,a);let s=`<svg viewBox="0 0 ${i+44} 102" style="width:100%; max-width:820px; display:block;">`;const c=r=>{if(r==="Idle")return"var(--bg-panel-elevated)";const p=parseInt(r.replace("P",""),10)||1,h=["#0284c7","#ea580c","#059669","#9333ea","#e11d48","#0891b2","#db2777","#65a30d"];return h[(p-1)%h.length]};let u=-100,l=!1;e.forEach(r=>{const p=r.start*d+22,h=Math.max(1.5,(r.end-r.start)*d),m=c(r.proc);s+=`<rect x="${p}" y="14" width="${h}" height="44" fill="${m}" stroke="var(--bg-deep)" stroke-width="1.5" rx="2"><title>${r.proc}: ${r.start} &rarr; ${r.end} (${r.end-r.start} ms)</title></rect>`,h>22&&(s+=`<text x="${p+h/2}" y="41" fill="#ffffff" font-weight="800" font-size="12.5" text-anchor="middle" font-family="var(--font-mono)">${r.proc}</text>`),s+=`<line x1="${p}" y1="58" x2="${p}" y2="66" stroke="var(--border-light)" stroke-width="1.5" />`;const v=p-u<24&&l?94:80;p-u<24?l=!l:l=!1,s+=`<text x="${p}" y="${v}" fill="var(--text-primary)" font-size="11.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">${r.start}</text>`,u=p});const n=a*d+22,o=n-u<24&&l?94:80;s+=`<line x1="${n}" y1="58" x2="${n}" y2="66" stroke="var(--border-light)" stroke-width="1.5" />`,s+=`<text x="${n}" y="${o}" fill="var(--color-amber)" font-size="12" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">${a}</text>`,s+="</svg>",t.innerHTML=s},renderTable(e,t=[],a=!1){const i=document.getElementById("w3-table-body"),d=document.getElementById("w3-summary"),s=document.getElementById("w3-handwritten");if(!i)return;let c=0,u=0,l=0;if(e.forEach(h=>{c+=h.tat,u+=h.wt,l+=h.rt}),a&&i.children.length===e.length)e.forEach(h=>{const m=h.origIdx,v=(f,g)=>{const y=document.getElementById(f);y&&(y.textContent=g)};v(`w3-ct-${m}`,h.ct),v(`w3-tat-${m}`,h.tat),v(`w3-wt-${m}`,h.wt),v(`w3-rt-${m}`,h.rt)});else{let h=e.map(m=>{const v=m.origIdx;return`
          <tr>
            <td><strong>${m.id}</strong></td>
            <td><input type="number" class="cell-num" id="w3-cell-at-${v}" min="0" max="60" value="${m.at}" oninput="W3_CPUScheduler.updateProcField(${v}, 'at', this.value)" /></td>
            <td><input type="number" class="cell-num" id="w3-cell-bt-${v}" min="1" max="60" value="${m.bt}" oninput="W3_CPUScheduler.updateProcField(${v}, 'bt', this.value)" /></td>
            <td><input type="number" class="cell-num" id="w3-cell-p-${v}" min="1" max="20" value="${m.p}" oninput="W3_CPUScheduler.updateProcField(${v}, 'p', this.value)" /></td>
            <td><strong id="w3-ct-${v}">${m.ct}</strong></td>
            <td id="w3-tat-${v}">${m.tat}</td>
            <td id="w3-wt-${v}">${m.wt}</td>
            <td id="w3-rt-${v}">${m.rt}</td>
            <td>${e.length>1?`<button type="button" class="btn-mini" title="Remove ${m.id}" onclick="W3_CPUScheduler.removeProcess(${v})">&times;</button>`:""}</td>
          </tr>
        `}).join("");i.innerHTML=h}const n=e.length,o=(c/n).toFixed(2),r=(u/n).toFixed(2),p=(l/n).toFixed(2);if(d&&(d.innerHTML=`
        <div style="display:flex; gap:24px; flex-wrap:wrap; font-size:0.95rem;">
          <div>Average Turnaround Time (TAT = CT - AT): <strong style="color:var(--primary); font-size:1.1rem;">${o} ms</strong></div>
          <div>Average Waiting Time (WT = TAT - BT): <strong style="color:var(--warning); font-size:1.1rem;">${r} ms</strong></div>
          <div>Average Response Time (RT): <strong style="color:var(--success); font-size:1.1rem;">${p} ms</strong></div>
        </div>
      `),s){const h=t.map(g=>`${g.start} &rarr; [${g.proc}: ${g.end-g.start}ms] &rarr; ${g.end}`).join(" | "),m=e.map(g=>g.tat).join(" + "),v=e.map(g=>g.wt).join(" + "),f=e.map(g=>g.rt).join(" + ");s.innerHTML=`
        <div class="hw-title"><span>✍️ Exam Paper Workings (As Written By Hand)</span><span>${this.algorithm}${this.algorithm==="RR"?` (q = ${this.quantum})`:""} | N = ${n}</span></div>
        <span class="hw-step"><strong>1. Trace Gantt Chart:</strong> ${h}</span>
        <span class="hw-step"><strong>2. Formulas:</strong> <span class="hw-sub">TAT = CT &minus; AT</span> ,  <span class="hw-sub">WT = TAT &minus; BT</span> ,  <span class="hw-sub">RT = FirstRun &minus; AT</span></span>
        ${e.map(g=>`<span class="hw-step">   ${g.id}: CT = ${g.ct},  TAT = ${g.ct} &minus; ${g.at} = <span class="hw-sub">${g.tat}</span>,  WT = ${g.tat} &minus; ${g.bt} = <span class="hw-sub">${g.wt}</span>,  RT = ${g.firstStart} &minus; ${g.at} = ${g.rt}</span>`).join("")}
        <span class="hw-step"><strong>3. Averages:</strong></span>
        <span class="hw-step">   Avg TAT = (${m}) / ${n} = ${c} / ${n} = <span class="hw-ans">${o} ms</span></span>
        <span class="hw-step">   Avg WT  = (${v}) / ${n} = ${u} / ${n} = <span class="hw-ans">${r} ms</span></span>
        <span class="hw-step">   Avg RT  = (${f}) / ${n} = ${l} / ${n} = <span class="hw-sub">${p} ms</span></span>
      `}}},E={alpha:.5,tau0:10,bursts:[6,4,6,4,13,13],init(){this.render()},updateAlpha(e){this.alpha=Math.max(0,Math.min(1,parseFloat(e)||0));const t=document.getElementById("w4-alpha-r"),a=document.getElementById("w4-alpha-n");t&&(t.value=this.alpha),a&&(a.value=this.alpha),this.render()},updateTau0(e){this.tau0=Math.max(0,Math.min(100,parseFloat(e)||0)),this.render()},updateBursts(e){const t=e.split(",").map(a=>parseFloat(a.trim())).filter(a=>!isNaN(a)&&a>0);t.length>0&&(this.bursts=t.slice(0,10)),this.render()},render(){const e=document.getElementById("w4-canvas");if(!e)return;const t=this.alpha,a=+(1-t).toFixed(4);let i=this.tau0;const d=[];this.bursts.forEach((s,c)=>{const u=t*s+(1-t)*i;d.push({idx:c,tauPrev:i,tn:s,nextTau:u}),i=u}),e.innerHTML=`
      <div class="handwritten-sheet">
        <div class="hw-title"><span>✍️ Exponential Averaging Exam Table (Silberschatz Fig. 5.4)</span><span>&alpha; = ${t.toFixed(2)} | &tau;<sub>0</sub> = ${this.tau0}</span></div>
        <span class="hw-step">Formula: &tau;<sub>n+1</sub> = &alpha;&middot;t<sub>n</sub> + (1 &minus; &alpha;)&middot;&tau;<sub>n</sub> = <span class="hw-sub">${t.toFixed(2)}&middot;t<sub>n</sub> + ${a.toFixed(2)}&middot;&tau;<sub>n</sub></span></span>
        ${d.map(s=>`<span class="hw-step">Step ${s.idx+1} (t<sub>${s.idx}</sub>=${s.tn}): &tau;<sub>${s.idx+1}</sub> = ${t.toFixed(2)}(${s.tn}) + ${a.toFixed(2)}(${s.tauPrev.toFixed(2)}) = ${(t*s.tn).toFixed(2)} + ${((1-t)*s.tauPrev).toFixed(2)} = <span class="hw-ans">${s.nextTau.toFixed(2)} ms</span></span>`).join("")}
      </div>
    `}},S={initPrio:10,waitTime:45,agingStep:15,topPrio:0,init(){this.render()},update(e,t,a){e!==null&&(this.initPrio=Math.max(0,Math.min(40,parseInt(e,10)||0))),t!==null&&(this.waitTime=Math.max(0,Math.min(300,parseInt(t,10)||0))),a!==null&&(this.agingStep=Math.max(1,Math.min(60,parseInt(a,10)||1)));const i=(d,s)=>{const c=document.getElementById(d);c&&c.value!=s&&(c.value=s)};i("w4b-ip-r",this.initPrio),i("w4b-ip-n",this.initPrio),i("w4b-wt-r",this.waitTime),i("w4b-wt-n",this.waitTime),i("w4b-st-r",this.agingStep),i("w4b-st-n",this.agingStep),this.render()},render(){const e=document.getElementById("w4b-canvas");if(!e)return;const t=Math.floor(this.waitTime/this.agingStep),a=Math.max(this.topPrio,this.initPrio-t);e.innerHTML=`
      <div class="handwritten-sheet">
        <div class="hw-title"><span>✍️ Aging Escalation Calculation (Lower Integer = Higher Priority)</span><span>Prevents Starvation</span></div>
        <span class="hw-step">Formula: EffectivePriority(t) = max(TopPriority, Initial &minus; &lfloor;WaitTime / Step&rfloor;)</span>
        <span class="hw-step">Boost Earned = &lfloor;${this.waitTime} / ${this.agingStep}&rfloor; = <span class="hw-sub">${t} priority levels</span></span>
        <span class="hw-step">New Priority = max(${this.topPrio}, ${this.initPrio} &minus; ${t}) = <span class="hw-ans">${a}</span> ${a===0?'<span class="hw-sub">(REACHED MAX URGENCY!)</span>':""}</span>
      </div>
    `}},D={counter:5,steps:[{actor:"Producer",code:"reg1 = counter",r1:5,r2:"-",c:5,desc:"Producer loads counter (5) into reg1."},{actor:"Producer",code:"reg1 = reg1 + 1",r1:6,r2:"-",c:5,desc:"Producer increments reg1 to 6."},{actor:"Consumer",code:"reg2 = counter",r1:6,r2:5,c:5,desc:"⚡ CONTEXT SWITCH: Consumer loads counter (5) into reg2!"},{actor:"Consumer",code:"reg2 = reg2 - 1",r1:6,r2:4,c:5,desc:"Consumer decrements reg2 to 4."},{actor:"Producer",code:"counter = reg1",r1:6,r2:4,c:6,desc:"⚡ Producer resumes: writes reg1 (6) to counter."},{actor:"Consumer",code:"counter = reg2",r1:6,r2:4,c:4,desc:"⚡ Consumer resumes: overwrites counter with reg2 (4)! Value 6 is LOST!"}],currentStep:0,init(){this.render()},setStep(e){this.currentStep=Math.max(0,Math.min(this.steps.length,parseInt(e,10)||0)),this.render()},next(){this.currentStep<this.steps.length&&(this.currentStep++,this.render())},reset(){this.currentStep=0,this.render()},render(){const e=document.getElementById("w5-table-body"),t=document.getElementById("w5-narr"),a=document.getElementById("w5-step-r"),i=document.getElementById("w5-step-n");if(a&&(a.value=this.currentStep),i&&(i.value=this.currentStep),!e)return;let d=this.currentStep>0?this.steps[this.currentStep-1]:{c:5,desc:"Initial state: counter = 5. Step through or scrub slider (0..6)."};t&&(t.innerHTML=`<strong>Step ${this.currentStep} / ${this.steps.length}:</strong> ${d.desc} <br>
      <span style="font-weight:700; color:${d.c!==5?"var(--color-crimson)":"var(--text-primary)"}">Current Shared counter = ${d.c}</span> (Expected without race condition: 5)`),e.innerHTML=this.steps.map((s,c)=>{const u=c<this.currentStep;return`
        <tr style="${c===this.currentStep-1?"background:var(--primary-glow); font-weight:bold;":u?"opacity:0.9;":"opacity:0.42;"}">
          <td>${c+1}</td>
          <td><span class="nav-badge" style="background:${s.actor==="Producer"?"var(--primary-glow)":"var(--warning-bg)"}; color:${s.actor==="Producer"?"var(--color-cyan)":"var(--color-amber)"}; border-color:${s.actor==="Producer"?"var(--color-cyan)":"var(--color-amber)"};">${s.actor}</span></td>
          <td><code>${s.code}</code></td>
          <td>${u?s.r1:"-"}</td>
          <td>${u?s.r2:"-"}</td>
          <td><strong style="color:${u&&s.c!==5?"var(--color-crimson)":"var(--text-primary)"};">${u?s.c:"-"}</strong></td>
        </tr>
      `}).join("")}},k={size:6,buffer:[null,null,null,null,null,null],inPtr:0,outPtr:0,itemCounter:1,init(){this.render()},setSize(e){this.size=Math.max(4,Math.min(10,parseInt(e,10)||6)),this.reset()},produce(){const e=(this.inPtr+1)%this.size,t=document.getElementById("w6-narr");if(e===this.outPtr){t&&(t.innerHTML=`<span style="color:var(--color-crimson)">⚠️ Buffer FULL! ( (in+1) % ${this.size} == out ). Producer must wait!</span>`);return}this.buffer[this.inPtr]=`Item ${this.itemCounter++}`,t&&(t.innerHTML=`Produced <strong>${this.buffer[this.inPtr]}</strong> at slot <strong>${this.inPtr}</strong>. Next in = ${e}.`),this.inPtr=e,this.render()},consume(){const e=document.getElementById("w6-narr");if(this.inPtr===this.outPtr){e&&(e.innerHTML='<span style="color:var(--color-amber)">⚠️ Buffer EMPTY! ( in == out ). Consumer must wait!</span>');return}const t=this.buffer[this.outPtr];this.buffer[this.outPtr]=null;const a=(this.outPtr+1)%this.size;e&&(e.innerHTML=`Consumed <strong>${t}</strong> from slot <strong>${this.outPtr}</strong>. Next out = ${a}.`),this.outPtr=a,this.render()},reset(){this.buffer=Array(this.size).fill(null),this.inPtr=0,this.outPtr=0,this.itemCounter=1,this.render()},render(){const e=document.getElementById("w6-canvas"),t=document.getElementById("w6-hand"),a=document.getElementById("w6-sz-r"),i=document.getElementById("w6-sz-n");if(a&&(a.value=this.size),i&&(i.value=this.size),!e)return;const d=this.buffer.filter(n=>n!==null).length;let s='<svg viewBox="0 0 460 270" style="width:100%; max-width:460px; display:block;">';const c=230,u=135,l=92;for(let n=0;n<this.size;n++){const o=n*2*Math.PI/this.size-Math.PI/2,r=c+l*Math.cos(o),p=u+l*Math.sin(o),h=this.buffer[n],m=this.inPtr===n,v=this.outPtr===n;s+=`<circle cx="${r}" cy="${p}" r="24" fill="${h?"var(--color-cyan)":"var(--bg-panel-elevated)"}" stroke="${m?"var(--color-amber)":v?"var(--color-emerald)":"var(--border-light)"}" stroke-width="${m||v?"2.5":"1.8"}" />`,s+=`<text x="${r}" y="${p-4}" fill="${h?"var(--on-primary)":"var(--text-secondary)"}" font-size="10.5" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">[${n}]</text>`,s+=`<text x="${r}" y="${p+11}" fill="${h?"var(--on-primary)":"var(--text-muted)"}" font-size="9.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">${h?h.replace("Item ","#"):"empty"}</text>`,m&&(s+=`<text x="${r}" y="${p+39}" fill="var(--color-amber)" font-size="10.5" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">&uarr; IN</text>`),v&&(s+=`<text x="${r}" y="${p-31}" fill="var(--color-emerald)" font-size="10.5" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">&darr; OUT</text>`)}if(s+=`<circle cx="${c}" cy="${u}" r="38" fill="var(--bg-panel)" stroke="var(--border-light)" stroke-width="1.5" />`,s+=`<text x="${c}" y="${u-5}" fill="var(--text-secondary)" font-size="10" text-anchor="middle">Occupied</text>`,s+=`<text x="${c}" y="${u+15}" fill="var(--color-cyan)" font-size="16" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">${d} / ${this.size-1}</text>`,s+="</svg>",e.innerHTML=s,t){const n=(this.inPtr+1)%this.size;t.innerHTML=`
        <div class="hw-title"><span>✍️ Circular Buffer Pointer Math</span><span>N = ${this.size} slots (${this.size-1} usable)</span></div>
        <span class="hw-step">in = ${this.inPtr}, out = ${this.outPtr} &rarr; nextIn = (${this.inPtr} + 1) mod ${this.size} = <span class="hw-sub">${n}</span></span>
        <span class="hw-step">Status: ${this.inPtr===this.outPtr?'<span class="hw-warn">EMPTY (in == out)</span>':n===this.outPtr?'<span class="hw-warn">FULL ((in+1)%N == out)</span>':`<span class="hw-ans">READY (${d} occupied, ${this.size-1-d} free)</span>`}</span>
      `}}},O={currentAlgo:"peterson",step:0,petersonSteps:[{p0Line:"flag[0] = true;",p1Line:"-",f0:!0,f1:!1,turn:0,cs:"None",desc:"P0 expresses intent to enter: flag[0] = true."},{p0Line:"turn = 1;",p1Line:"-",f0:!0,f1:!1,turn:1,cs:"None",desc:"P0 sets turn = 1 (gives priority to P1)."},{p0Line:"-",p1Line:"flag[1] = true;",f0:!0,f1:!0,turn:1,cs:"None",desc:"P1 expresses intent to enter: flag[1] = true."},{p0Line:"-",p1Line:"turn = 0;",f0:!0,f1:!0,turn:0,cs:"None",desc:"P1 sets turn = 0 (gives priority to P0)."},{p0Line:"while(flag[1] && turn==1);",p1Line:"while(flag[0] && turn==0);",f0:!0,f1:!0,turn:0,cs:"P0 ENTERS CS",desc:"P0 check: flag[1]==true but turn!=1 (turn is 0) &rarr; P0 enters CS! P1 spins (turn==0)."},{p0Line:"flag[0] = false;",p1Line:"-",f0:!1,f1:!0,turn:0,cs:"P1 ENTERS CS",desc:"P0 exits CS and sets flag[0] = false. P1 leaves spin loop and enters CS!"}],init(){this.render()},setStep(e){this.step=Math.max(0,Math.min(this.petersonSteps.length,parseInt(e,10)||0)),this.render()},nextStep(){this.step<this.petersonSteps.length&&(this.step++,this.render())},reset(){this.step=0,this.render()},render(){const e=document.getElementById("w7-table-body"),t=document.getElementById("w7-narr"),a=document.getElementById("w7-step-r"),i=document.getElementById("w7-step-n");if(a&&(a.value=this.step),i&&(i.value=this.step),!e)return;const d=this.step>0?this.petersonSteps[this.step-1]:{cs:"None",desc:"Initial: flag[0]=false, flag[1]=false, turn=0. Step or scrub slider (0..6)."};t&&(t.innerHTML=`<strong>Step ${this.step} / ${this.petersonSteps.length}:</strong> ${d.desc} <br>
      Active in Critical Section: <strong style="color:var(--color-cyan); font-size:1.05rem;">${d.cs}</strong>`),e.innerHTML=this.petersonSteps.map((s,c)=>{const u=c<this.step;return`
        <tr style="${c===this.step-1?"background:var(--primary-glow); font-weight:bold;":u?"opacity:0.9;":"opacity:0.42;"}">
          <td>${c+1}</td>
          <td><code>${s.p0Line}</code></td>
          <td><code>${s.p1Line}</code></td>
          <td>${u?s.f0?"True":"False":"-"}</td>
          <td>${u?s.f1?"True":"False":"-"}</td>
          <td>${u?s.turn:"-"}</td>
          <td><strong style="color:${s.cs.includes("ENTERS")?"var(--color-emerald)":"var(--text-secondary)"}">${u?s.cs:"-"}</strong></td>
        </tr>
      `}).join("")}},R={initValue:1,value:1,queue:[],procCount:1,init(){this.render()},setInitial(e){this.initValue=Math.max(0,Math.min(8,parseInt(e,10)||1)),this.reset()},wait(){const e=`P${this.procCount++}`;this.value--;const t=document.getElementById("w8-narr");this.value<0?(this.queue.push(e),t&&(t.innerHTML=`<code>wait()</code> called by <strong>${e}</strong>. S = <strong>${this.value}</strong> (&lt; 0) &rarr; <strong>${e} BLOCKED</strong> (queued |${this.value}| = ${this.queue.length} waiting).`)):t&&(t.innerHTML=`<code>wait()</code> called by <strong>${e}</strong>. S = <strong>${this.value}</strong> (&ge; 0) &rarr; <strong>${e} ENTERS CS</strong>.`),this.render()},signal(){const e=document.getElementById("w8-narr");if(this.value++,this.value<=0&&this.queue.length>0){const t=this.queue.shift();e&&(e.innerHTML=`<code>signal()</code> called. S = <strong>${this.value}</strong> (&le; 0) &rarr; <strong>${t} WOKEN UP</strong> to enter CS!`)}else e&&(e.innerHTML=`<code>signal()</code> called. S = <strong>${this.value}</strong>. Queue empty; resource free.`);this.render()},reset(){this.value=this.initValue,this.queue=[],this.procCount=1;const e=document.getElementById("w8-narr");e&&(e.innerHTML=`Semaphore initialized to S = ${this.value}. Click wait() / signal() to trace.`),this.render()},render(){const e=document.getElementById("w8-val"),t=document.getElementById("w8-queue"),a=document.getElementById("w8-init-r"),i=document.getElementById("w8-init-n");a&&(a.value=this.initValue),i&&(i.value=this.initValue),e&&(e.innerText=this.value,e.style.color=this.value<0?"var(--color-crimson)":this.value===0?"var(--color-amber)":"var(--color-emerald)"),t&&(this.queue.length===0?t.innerHTML='<span style="color:var(--text-secondary);">[ Empty Queue ]</span>':t.innerHTML=this.queue.map(d=>`
          <span class="nav-badge" style="background:var(--danger-bg); color:var(--color-crimson); border-color:var(--color-crimson); font-size:0.85rem; padding:4px 10px; margin-right:6px;">${d} (Blocked)</span>
        `).join(""))}},U={states:["THINKING","THINKING","THINKING","THINKING","THINKING"],chopsticks:[!0,!0,!0,!0,!0],init(){this.render()},toggle(e){const t=document.getElementById("w10-narr");if(this.states[e]==="THINKING"||this.states[e]==="HUNGRY"){this.states[e]="HUNGRY";const a=e,i=(e+1)%5;this.chopsticks[a]&&this.chopsticks[i]?(this.chopsticks[a]=!1,this.chopsticks[i]=!1,this.states[e]="EATING",t&&(t.innerHTML=`Philosopher <strong>P${e}</strong> acquired chopsticks C${a} &amp; C${i} &rarr; Now <strong style="color:var(--color-emerald)">EATING</strong>!`)):t&&(t.innerHTML=`Philosopher <strong>P${e}</strong> is <strong style="color:var(--color-amber)">HUNGRY</strong> waiting for busy chopstick C${this.chopsticks[a]?i:a}.`)}else this.states[e]==="EATING"&&(this.chopsticks[e]=!0,this.chopsticks[(e+1)%5]=!0,this.states[e]="THINKING",t&&(t.innerHTML=`Philosopher <strong>P${e}</strong> put down chopsticks C${e} &amp; C${(e+1)%5}. Now <strong style="color:var(--color-cyan)">THINKING</strong>.`));this.render()},triggerDeadlock(){const e=document.getElementById("w10-narr");this.states=["HUNGRY","HUNGRY","HUNGRY","HUNGRY","HUNGRY"],this.chopsticks=[!1,!1,!1,!1,!1],e&&(e.innerHTML=`
        <strong style="color:var(--color-crimson)">⚠️ CIRCULAR DEADLOCK OCCURRED!</strong><br>
        Every P<sub>i</sub> holds left chopstick C<sub>i</sub> and blocks forever waiting for right chopstick C<sub>(i+1)%5</sub>.
      `),this.render()},reset(){this.states=["THINKING","THINKING","THINKING","THINKING","THINKING"],this.chopsticks=[!0,!0,!0,!0,!0];const e=document.getElementById("w10-narr");e&&(e.innerHTML="Click any Philosopher circle (P0..P4) to toggle THINKING &harr; HUNGRY/EATING."),this.render()},render(){const e=document.getElementById("w10-canvas");if(!e)return;let t='<svg viewBox="0 0 420 330" style="width:100%; max-width:420px; display:block;">';const a=210,i=165,d=92;t+=`<circle cx="${a}" cy="${i}" r="${d}" fill="var(--bg-panel-elevated)" stroke="var(--border-light)" stroke-width="2" />`,t+=`<text x="${a}" y="${i-4}" fill="var(--text-primary)" font-size="12" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">Dining Table</text>`,t+=`<text x="${a}" y="${i+14}" fill="var(--text-secondary)" font-size="10" text-anchor="middle" font-family="var(--font-mono)">(Click P0..P4)</text>`;for(let s=0;s<5;s++){const c=s*2*Math.PI/5-Math.PI/2,u=a+(d+44)*Math.cos(c),l=i+(d+44)*Math.sin(c),n=this.states[s],o=n==="EATING"?"var(--color-emerald)":n==="HUNGRY"?"var(--color-amber)":"var(--color-cyan)",r="var(--on-primary)";t+=`<circle cx="${u}" cy="${l}" r="23" fill="${o}" stroke="var(--border-light)" stroke-width="2" style="cursor:pointer;" onclick="W10_DiningPhilosophers.toggle(${s})"/>`,t+=`<text x="${u}" y="${l+1}" fill="${r}" font-weight="800" font-size="11.5" text-anchor="middle" pointer-events="none" font-family="var(--font-mono)">P${s}</text>`,t+=`<text x="${u}" y="${l+12}" fill="${r}" font-weight="700" font-size="7.5" text-anchor="middle" pointer-events="none" font-family="var(--font-mono)">${n.slice(0,5)}</text>`;const p=c+Math.PI/5,h=a+(d-18)*Math.cos(p),m=i+(d-18)*Math.sin(p),v=this.chopsticks[s];t+=`<rect x="${h-4}" y="${m-12}" width="8" height="24" rx="4" fill="${v?"var(--color-emerald)":"var(--color-crimson)"}" stroke="var(--bg-deep)" stroke-width="1" transform="rotate(${p*180/Math.PI+90}, ${h}, ${m})"/>`,t+=`<text x="${h}" y="${m+20}" fill="var(--text-secondary)" font-size="8.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">C${s}</text>`}t+="</svg>",e.innerHTML=t}},K={allocation:[[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]],max:[[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]],available:[3,3,2],reqProc:1,reqVec:[1,0,2],lastMsg:"",init(){this.lastMsg="",this.runSafety(!1)},updateCell(e,t,a,i){const d=Math.max(0,Math.min(20,parseInt(i,10)||0));e==="alloc"?this.allocation[t][a]=d:e==="max"?this.max[t][a]=d:e==="avail"&&(this.available[a]=d),this.lastMsg="",this.runSafety(!0)},setRequestParam(e,t,a){e!==null&&(this.reqProc=Math.max(0,Math.min(4,parseInt(e,10)||0))),t!==null&&(this.reqVec[t]=Math.max(0,Math.min(20,parseInt(a,10)||0)))},testRequest(){const e=this.reqProc,t=[...this.reqVec],a=[this.max[e][0]-this.allocation[e][0],this.max[e][1]-this.allocation[e][1],this.max[e][2]-this.allocation[e][2]],i=t[0]<=a[0]&&t[1]<=a[1]&&t[2]<=a[2],d=t[0]<=this.available[0]&&t[1]<=this.available[1]&&t[2]<=this.available[2];if(!i){this.lastMsg=`<strong style="color:var(--color-crimson)">❌ DENIED (Condition 1 Failed):</strong> Request (${t.join(", ")}) exceeds Need[${e}] (${a.join(", ")}). Illegal claim!`,b.alarm(),this.runSafety(!1);return}if(!d){this.lastMsg=`<strong style="color:var(--color-amber)">⏳ MUST WAIT (Condition 2 Failed):</strong> Request (${t.join(", ")}) exceeds Available (${this.available.join(", ")}). P${e} blocks.`,b.alarm(),this.runSafety(!1);return}const s=[...this.available],c=[...this.allocation[e]];for(let l=0;l<3;l++)this.available[l]-=t[l],this.allocation[e][l]+=t[l];const u=this.runSafety(!1,!0);u.safe?(b.chime(),this.lastMsg=`
        <strong style="color:var(--color-emerald)">✅ Request (${t.join(", ")}) by P${e} GRANTED!</strong><br>
        Cond 1: (${t.join(",")}) &le; Need (${a.join(",")}) ✓ &nbsp;|&nbsp;
        Cond 2: (${t.join(",")}) &le; Avail (${s.join(",")}) ✓ &rarr; New Avail = (${this.available.join(",")})<br>
        Pretend allocation yields <strong>SAFE SEQUENCE</strong>: &lang; ${u.sequence.join(", ")} &rang;.
      `):(this.available=s,this.allocation[e]=c,b.alarm(),this.lastMsg=`
        <strong style="color:var(--color-crimson)">⚠️ UNSAFE &rarr; REQUEST ROLLED BACK (P${e} must wait):</strong><br>
        Cond 1 &amp; Cond 2 held, but granting (${t.join(",")}) drops Available too low to guarantee completion of all processes. System restores Available = (${s.join(",")}).
      `),this.runSafety(!1)},reset(){this.allocation=[[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]],this.max=[[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]],this.available=[3,3,2],this.reqProc=1,this.reqVec=[1,0,2],this.lastMsg="";const e=document.getElementById("w12-req-p");e&&(e.value=1),[0,1,2].forEach(t=>{const a=document.getElementById(`w12-req-${t}`);a&&(a.value=this.reqVec[t])}),this.runSafety(!1)},runSafety(e=!1,t=!1){let i=[];for(let r=0;r<5;r++)i.push([this.max[r][0]-this.allocation[r][0],this.max[r][1]-this.allocation[r][1],this.max[r][2]-this.allocation[r][2]]);let d=[...this.available],s=[!1,!1,!1,!1,!1],c=[],u=[],l=0,n=0;for(;l<5;){let r=!1;for(let p=0;p<5;p++){let h=(n+p)%5;if(!s[h]&&i[h][0]<=d[0]&&i[h][1]<=d[1]&&i[h][2]<=d[2]){n=(h+1)%5;const m=[...d];d[0]+=this.allocation[h][0],d[1]+=this.allocation[h][1],d[2]+=this.allocation[h][2],s[h]=!0,c.push(`P${h}`),r=!0,l++,u.push({proc:`P${h}`,need:i[h],workBefore:m,alloc:[...this.allocation[h]],workAfter:[...d],seq:[...c]});break}}if(!r)break}const o=l===5;return t||this.renderTable(i,o,c,u,e),{safe:o,sequence:c}},renderTable(e,t,a,i,d=!1){const s=document.getElementById("w12-table-body"),c=document.getElementById("w12-narr"),u=document.getElementById("w12-trace"),l=document.getElementById("w12-handwritten");if(s&&(d&&s.children.length===this.allocation.length?e.forEach((n,o)=>{const r=document.getElementById(`w12-need-${o}`);r&&(r.textContent=n.join(" "))}):s.innerHTML=this.allocation.map((n,o)=>`
        <tr>
          <td><strong>P${o}</strong></td>
          <td>${[0,1,2].map(r=>`<input type="number" class="cell-num" style="width:42px;margin-right:2px;" min="0" max="20" value="${n[r]}" oninput="W12_Bankers.updateCell('alloc',${o},${r},this.value)"/>`).join("")}</td>
          <td>${[0,1,2].map(r=>`<input type="number" class="cell-num" style="width:42px;margin-right:2px;" min="0" max="20" value="${this.max[o][r]}" oninput="W12_Bankers.updateCell('max',${o},${r},this.value)"/>`).join("")}</td>
          <td><strong id="w12-need-${o}" style="color:var(--color-cyan);">${e[o].join(" ")}</strong></td>
          <td>${o===0?[0,1,2].map(r=>`<input type="number" class="cell-num" style="width:42px;margin-right:2px;" min="0" max="20" value="${this.available[r]}" oninput="W12_Bankers.updateCell('avail',0,${r},this.value)"/>`).join(""):""}</td>
        </tr>
      `).join(""),c&&(this.lastMsg?c.innerHTML=this.lastMsg:t?c.innerHTML=`
          <strong style="color:var(--color-emerald)">SAFE STATE!</strong> Safe Sequence: 
          <span style="font-size:1.08rem; font-weight:bold; color:var(--color-cyan);">&lang; ${a.join(", ")} &rang;</span>
          <br><span style="color:var(--text-secondary)">Edit any Allocation / Max / Available cell above or test a Resource Request!</span>
        `:c.innerHTML=`<strong style="color:var(--color-crimson)">⚠️ UNSAFE STATE!</strong> Only completed &lang; ${a.join(", ")||"None"} &rang;; remaining processes exceed Work = (${i.length?i[i.length-1].workAfter.join(","):this.available.join(",")}).`),u&&(u.innerHTML=`
        <h4 style="margin:12px 0 6px; font-size:0.95rem; color:var(--color-cyan);">Step-by-Step Safety Trace:</h4>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Process</th>
                <th>Need &le; Work Check</th>
                <th>+ Alloc</th>
                <th>New Work</th>
                <th>Sequence</th>
              </tr>
            </thead>
            <tbody>
              ${i.map((n,o)=>`
                <tr>
                  <td>${o+1}</td>
                  <td><strong>${n.proc}</strong></td>
                  <td>[${n.need.join(",")}] &le; [${n.workBefore.join(",")}] &rarr; <span style="color:var(--color-emerald); font-weight:bold;">PASS</span></td>
                  <td>+ [${n.alloc.join(",")}]</td>
                  <td><strong>[${n.workAfter.join(",")}]</strong></td>
                  <td>&lang; ${n.seq.join(", ")} &rang;</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `),l)){const n=this.allocation.map((r,p)=>`   P${p}: (${this.max[p].join(",")}) &minus; (${r.join(",")}) = <span class="hw-sub">(${e[p].join(",")})</span>`).join(`
`),o=i.map((r,p)=>`   ${p+1}. Check ${r.proc}: (${r.need.join(",")}) &le; (${r.workBefore.join(",")}) &check; &rArr; Work = (${r.workBefore.join(",")}) + (${r.alloc.join(",")}) = <span class="hw-sub">(${r.workAfter.join(",")})</span>`).join(`
`);l.innerHTML=`
        <div class="hw-title"><span>✍️ Exam Paper Workings (As Written By Hand)</span><span>Banker's Need &amp; Safety Proof</span></div>
        <span class="hw-step"><strong>Step 1 — Compute Need = Max &minus; Allocation:</strong>
${n}</span>
        <span class="hw-step"><strong>Step 2 — Safety Trace starting from Work = Available = (${this.available.join(", ")}):</strong>
${o||"   No process satisfied Need <= Work!"}</span>
        <span class="hw-step"><strong>Result:</strong> <span class="${t?"hw-ans":"hw-warn"}">${t?"SAFE SEQUENCE: < "+a.join(", ")+" >":"UNSAFE (Insufficient Available for remaining Need)"}</span></span>
      `}}},B={lastStrat:"first",holeSizes:[100,500,200,300,600],procSizes:[212,417,112,426],parseList(e){return e.split(",").map(t=>parseInt(t.trim(),10)).filter(t=>!isNaN(t)&&t>0)},updateHoles(e){const t=this.parseList(e);t.length>0&&(this.holeSizes=t.slice(0,8),this.run(this.lastStrat==="none"?"first":this.lastStrat))},updateProcs(e){const t=this.parseList(e);t.length>0&&(this.procSizes=t.slice(0,8),this.run(this.lastStrat==="none"?"first":this.lastStrat))},run(e){this.lastStrat=e;const t=this.holeSizes.map(c=>({size:c,free:c,proc:null,pSize:0})),a=this.procSizes.map((c,u)=>({id:`P${u+1}`,size:c}));let i=0,d=[],s=[];a.forEach(c=>{let u=-1;if(e==="first")u=t.findIndex(l=>l.proc===null&&l.size>=c.size);else if(e==="best"){let l=1/0;t.forEach((n,o)=>{if(n.proc===null&&n.size>=c.size){let r=n.size-c.size;r<l&&(l=r,u=o)}})}else if(e==="worst"){let l=-1;t.forEach((n,o)=>{if(n.proc===null&&n.size>=c.size){let r=n.size-c.size;r>l&&(l=r,u=o)}})}u!==-1?(t[u].proc=c.id,t[u].pSize=c.size,t[u].free=t[u].size-c.size,i+=t[u].free,s.push(`${c.id} (${c.size} KB) &rarr; Hole #${u+1} (${t[u].size} KB) | Leftover = ${t[u].size} &minus; ${c.size} = <span class="hw-sub">${t[u].free} KB</span>`)):(d.push(`${c.id} (${c.size} KB)`),s.push(`${c.id} (${c.size} KB) &rarr; <span class="hw-warn">MUST WAIT (No free partition &ge; ${c.size} KB!)</span>`))}),this.render(e,t,i,d,s)},reset(){this.holeSizes=[100,500,200,300,600],this.procSizes=[212,417,112,426];const e=document.getElementById("w13-holes");e&&(e.value=this.holeSizes.join(", "));const t=document.getElementById("w13-procs");t&&(t.value=this.procSizes.join(", ")),this.run("first")},render(e,t,a,i,d=[]){const s=document.getElementById("w13-canvas"),c=document.getElementById("w13-summary"),u=document.getElementById("w13-handwritten");if(!s)return;const l=t.filter(o=>o.proc===null).reduce((o,r)=>o+r.size,0);c&&(c.innerHTML=`
        Strategy: <strong style="color:var(--color-cyan);">${e.toUpperCase()} FIT</strong> &nbsp;|&nbsp;
        Leftover Fragments Inside Used Holes: <strong style="color:var(--color-amber);">${a} KB</strong> &nbsp;|&nbsp;
        Total Free Unallocated Holes: <strong style="color:var(--text-primary);">${l} KB</strong> &nbsp;|&nbsp;
        Waiting / Unallocated: <strong style="color:${i.length>0?"var(--color-crimson)":"var(--color-emerald)"};">${i.length>0?i.join(", "):"None (All allocated)"}</strong>
      `);let n='<div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:640px;">';t.forEach((o,r)=>{const p=o.proc!==null;n+=`
        <div style="border:1px solid var(--border-light); border-radius:6px; overflow:hidden; background:var(--bg-panel);">
          <div style="display:flex; justify-content:space-between; padding:4px 10px; font-size:0.8rem; background:var(--bg-panel-elevated); color:var(--text-secondary);">
            <span>Partition #${r+1} (${o.size} KB)</span>
            <span>${p?`Occupied by <strong style="color:var(--text-primary)">${o.proc} (${o.pSize} KB)</strong> | Unused: ${o.free} KB`:"FREE HOLE"}</span>
          </div>
          <div style="display:flex; height:32px; width:100%;">
            ${p?`
              <div style="width:${o.pSize/o.size*100}%; background:var(--color-cyan); display:flex; align-items:center; justify-content:center; color:var(--on-primary); font-size:0.85rem; font-weight:800;">
                ${o.proc} (${o.pSize}K)
              </div>
              <div style="width:${o.free/o.size*100}%; background:var(--warning-bg); border-left:1px dashed var(--color-amber); display:flex; align-items:center; justify-content:center; color:var(--color-amber); font-size:0.75rem; font-weight:700;">
                ${o.free>0?`${o.free}K free`:""}
              </div>
            `:`
              <div style="width:100%; background:var(--bg-panel); display:flex; align-items:center; justify-content:center; color:var(--text-secondary); font-size:0.85rem;">
                Free Hole (${o.size} KB)
              </div>
            `}
          </div>
        </div>
      `}),n+="</div>",s.innerHTML=n,u&&(u.innerHTML=`
        <div class="hw-title"><span>✍️ Exam Workings (As Written By Hand)</span><span>${e.toUpperCase()} FIT TRACE</span></div>
        ${d.map((o,r)=>`<span class="hw-step">${r+1}) ${o}</span>`).join("")}
        <span class="hw-step">Total Unused Fragments in Allocated Partitions = <span class="hw-sub">${a} KB</span> | Unallocated Waiting: <span class="${i.length?"hw-warn":"hw-ans"}">${i.length?i.join(", "):"0 (ALL FIT)"}</span></span>
      `)}},T={pageSize:1024,pageTable:{0:5,1:6,2:1,3:2,4:8,5:3,6:9,7:4},hitRatio:80,tlbNs:20,memNs:100,setLA(e){const t=Math.max(0,Math.min(8191,parseInt(e,10)||0)),a=document.getElementById("w14-la-r"),i=document.getElementById("w14-la");a&&a.value!=t&&(a.value=t),i&&i.value!=t&&(i.value=t),this.translate()},setFrame(e,t){this.pageTable[e]=Math.max(0,Math.min(63,parseInt(t,10)||0)),this.translate()},setEAT(e,t,a){e!==null&&(this.hitRatio=Math.max(0,Math.min(100,parseFloat(e)||0))),t!==null&&(this.tlbNs=Math.max(1,Math.min(200,parseFloat(t)||1))),a!==null&&(this.memNs=Math.max(10,Math.min(1e3,parseFloat(a)||10)));const i=(d,s)=>{const c=document.getElementById(d);c&&c.value!=s&&(c.value=s)};i("w14-a-r",this.hitRatio),i("w14-a-n",this.hitRatio),i("w14-e-r",this.tlbNs),i("w14-e-n",this.tlbNs),i("w14-m-r",this.memNs),i("w14-m-n",this.memNs),this.renderEAT()},translate(){const e=document.getElementById("w14-la"),t=document.getElementById("w14-ps"),a=document.getElementById("w14-p"),i=document.getElementById("w14-d"),d=document.getElementById("w14-frame"),s=document.getElementById("w14-pa"),c=document.getElementById("w14-narr"),u=parseInt(e?e.value:3085,10)||0,l=parseInt(t?t.value:1024,10)||1024,n=Math.round(Math.log2(l)),o=Math.floor(u/l),r=u%l,p=this.pageTable[o]!==void 0?this.pageTable[o]:(o*3+2)%16,h=p*l+r;a&&(a.innerText=o),i&&(i.innerText=r),d&&(d.innerText=p),s&&(s.innerText=h),c&&(c.innerHTML=`
        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Address Translation (As Written By Hand)</span><span>Page Size = ${l} B (2<sup>${n}</sup> &rArr; ${n}-bit offset d)</span></div>
          <span class="hw-step">1) Page Number p = &lfloor; ${u} / ${l} &rfloor; = <span class="hw-sub">${o}</span></span>
          <span class="hw-step">2) Page Offset d = ${u} mod ${l} = ${u} &minus; (${o} &times; ${l}) = <span class="hw-sub">${r}</span></span>
          <span class="hw-step">3) Page Table Lookup: Page[${o}] &rarr; Frame <span class="hw-sub">f = ${p}</span></span>
          <span class="hw-step">4) Physical Address PA = (f &times; PageSize) + d = (${p} &times; ${l}) + ${r} = ${p*l} + ${r} = <span class="hw-ans">${h}</span></span>
        </div>
      `),this.renderEAT()},renderEAT(){const e=document.getElementById("w14-eat-hand");if(!e)return;const t=this.hitRatio/100,a=1-t,i=this.tlbNs,d=this.memNs,s=i+d,c=i+2*d,u=t*s+a*c,l=(u-d)/d*100;e.innerHTML=`
      <div class="handwritten-sheet">
        <div class="hw-title"><span>✍️ TLB Effective Access Time (As Written By Hand)</span><span>&alpha; = ${this.hitRatio}% | &epsilon; = ${i}ns | RAM = ${d}ns</span></div>
        <span class="hw-step">Formula: EAT = &alpha;&middot;(&epsilon; + m) + (1 &minus; &alpha;)&middot;(&epsilon; + 2m)</span>
        <span class="hw-step">       = ${t.toFixed(2)}&middot;(${i} + ${d}) + ${a.toFixed(2)}&middot;(${i} + 2&times;${d})</span>
        <span class="hw-step">       = ${t.toFixed(2)}(${s}) + ${a.toFixed(2)}(${c}) = ${(t*s).toFixed(2)} + ${(a*c).toFixed(2)} = <span class="hw-ans">${u.toFixed(2)} ns</span> (+${l.toFixed(1)}% vs bare RAM)</span>
      </div>
    `}},A={algo:"FIFO",refString:[7,0,1,2,0,3,0,4,2,3,0,3,0,3,2,1,2,0,1,7,0,1],nFrames:3,loadPreset(e){e==="belady"?this.refString=[1,2,3,4,1,2,5,1,2,3,4,5]:this.refString=[7,0,1,2,0,3,0,4,2,3,0,3,0,3,2,1,2,0,1,7,0,1];const t=document.getElementById("w15-refs");t&&(t.value=this.refString.join(",")),this.run(this.algo)},setFrames(e){this.nFrames=Math.max(1,Math.min(6,parseInt(e,10)||3));const t=document.getElementById("w15-f-r"),a=document.getElementById("w15-f-n");t&&(t.value=this.nFrames),a&&(a.value=this.nFrames),this.run(this.algo)},setRefs(e){const t=e.split(",").map(a=>parseInt(a.trim(),10)).filter(a=>!isNaN(a)&&a>=0);t.length>0&&(this.refString=t.slice(0,26),this.run(this.algo))},run(e){e&&(this.algo=e);const t=this.refString,a=this.nFrames;let i=[],d=0,s=0,c=[];if(this.algo==="FIFO"){let u=[];t.forEach(l=>{if(i.includes(l))s++,c.push({ref:l,frames:[...i],fault:!1,victim:null});else{d++;let o=null;if(i.length<a)i.push(l),u.push(l);else{o=u.shift();let r=i.indexOf(o);i[r]=l,u.push(l)}c.push({ref:l,frames:[...i],fault:!0,victim:o})}})}else if(this.algo==="LRU"){let u=new Map;t.forEach((l,n)=>{if(i.includes(l))s++,u.set(l,n),c.push({ref:l,frames:[...i],fault:!1,victim:null});else{d++;let r=null;if(i.length<a)i.push(l);else{r=i[0];let p=u.get(r);i.forEach(m=>{u.get(m)<p&&(p=u.get(m),r=m)});let h=i.indexOf(r);i[h]=l}u.set(l,n),c.push({ref:l,frames:[...i],fault:!0,victim:r})}})}else this.algo==="OPT"&&t.forEach((u,l)=>{if(i.includes(u))s++,c.push({ref:u,frames:[...i],fault:!1,victim:null});else{d++;let o=null;if(i.length<a)i.push(u);else{o=i[0];let r=-1;i.forEach(h=>{let m=t.slice(l+1).indexOf(h);m===-1?(o=h,r=1/0):m>r&&r!==1/0&&(r=m,o=h)});let p=i.indexOf(o);i[p]=u}c.push({ref:u,frames:[...i],fault:!0,victim:o})}});this.render(this.algo,c,d,s,a)},render(e,t,a,i,d){const s=document.getElementById("w15-grid"),c=document.getElementById("w15-summary"),u=document.getElementById("w15-handwritten");if(!s)return;const l=(a/this.refString.length*100).toFixed(1),n=(i/this.refString.length*100).toFixed(1);c&&(c.innerHTML=`
        <span style="font-size:1.05rem; font-weight:bold; color:var(--color-cyan);">${e} (${d} Frames):</span>
        Page Faults = <strong style="color:var(--color-crimson); font-size:1.1rem;">${a}</strong> &nbsp;|&nbsp;
        Hits = <strong style="color:var(--color-emerald); font-size:1.1rem;">${i}</strong> &nbsp;|&nbsp;
        Fault Rate = <strong>${l}%</strong>
      `);const o=Array.from({length:d},(p,h)=>h);let r='<div style="display:flex; gap:5px; overflow-x:auto; padding-bottom:10px;">';if(t.forEach((p,h)=>{r+=`
        <div style="display:flex; flex-direction:column; align-items:center; min-width:34px;">
          <div style="font-size:9px; color:var(--text-muted); font-family:var(--font-mono);">t${h+1}</div>
          <div style="font-weight:800; color:var(--color-cyan); margin-bottom:4px; font-size:0.95rem; font-family:var(--font-mono);">${p.ref}</div>
          <div style="border:1.5px solid ${p.fault?"var(--color-crimson)":"var(--color-emerald)"}; border-radius:4px; width:100%; display:flex; flex-direction:column; background:var(--bg-panel);">
            ${o.map(m=>`
              <div style="height:26px; display:flex; align-items:center; justify-content:center; border-bottom:${m<d-1?"1px solid var(--border-trace)":"none"}; font-family:var(--font-mono); font-size:0.85rem; font-weight:${p.frames[m]===p.ref?"800":"500"}; color:${p.frames[m]===p.ref?"var(--color-cyan)":"var(--text-primary)"}; background:${p.frames[m]===p.ref&&p.fault?"var(--primary-glow)":"transparent"};">
                ${p.frames[m]!==void 0?p.frames[m]:"-"}
              </div>
            `).join("")}
          </div>
          <div style="margin-top:5px; font-size:0.75rem; font-weight:800; font-family:var(--font-mono); color:${p.fault?"var(--color-crimson)":"var(--color-emerald)"};">
            ${p.fault?"F":"H"}
          </div>
        </div>
      `}),r+="</div>",s.innerHTML=r,u){const p=t.map((h,m)=>h.victim!==null?`t${m+1}(ref ${h.ref}&rarr;evict ${h.victim})`:null).filter(Boolean);u.innerHTML=`
        <div class="hw-title"><span>✍️ Page Replacement Exam Trace (As Written By Hand)</span><span>${e} | Frames = ${d}</span></div>
        <span class="hw-step">Total References = ${this.refString.length} &rarr; Page Faults = <span class="hw-warn">${a}</span> , Page Hits = <span class="hw-sub">${i}</span></span>
        <span class="hw-step">Fault Rate = ${a} / ${this.refString.length} = <span class="hw-ans">${l}%</span> &nbsp;|&nbsp; Hit Ratio = ${i} / ${this.refString.length} = <span class="hw-sub">${n}%</span></span>
        <span class="hw-step">Victim Evictions: <span class="hw-dim">${p.length?p.join(", "):"None (all fit without replacement)"}</span></span>
      `}}},$={algo:"FCFS",queue:[98,183,37,122,14,124,65,67],head:53,cylinders:200,direction:"down",syncInputs(){const e=(a,i)=>{const d=document.getElementById(a);d&&d.value!=i&&(d.value=i)};e("w16-head-r",this.head),e("w16-head-n",this.head),e("w16-cyl-n",this.cylinders),e("w16-dir",this.direction);const t=document.getElementById("w16-queue");t&&document.activeElement!==t&&(t.value=this.queue.join(", "))},loadReviewQueueExample(){this.queue=[130,1750,1022,1509,948,1774,913,1470,86],this.head=143,this.cylinders=5e3,this.direction="up",this.syncInputs(),this.run("FCFS")},loadStandardExample(){this.queue=[98,183,37,122,14,124,65,67],this.head=53,this.cylinders=200,this.direction="down",this.syncInputs(),this.run("FCFS")},updateParam(e,t){if(e==="head"){this.head=Math.max(0,Math.min(this.cylinders-1,parseInt(t,10)||0));const a=document.getElementById("w16-head-r"),i=document.getElementById("w16-head-n");a&&a.value!=this.head&&(a.value=this.head),i&&i.value!=this.head&&(i.value=this.head)}else if(e==="cyl"){this.cylinders=Math.max(20,Math.min(1e4,parseInt(t,10)||200));const a=document.getElementById("w16-head-r");a&&(a.max=this.cylinders-1),this.head>=this.cylinders&&(this.head=this.cylinders-1)}else if(e==="dir")this.direction=t==="up"?"up":"down";else if(e==="queue"){const a=t.split(",").map(i=>parseInt(i.trim(),10)).filter(i=>!isNaN(i)&&i>=0&&i<this.cylinders);a.length>0&&(this.queue=a.slice(0,16))}this.run(this.algo)},run(e){e&&(this.algo=e);const t=[...this.queue],a=this.head,i=this.cylinders-1;let d=[a],s=0,c=t.filter(n=>n<a).sort((n,o)=>o-n),u=t.filter(n=>n>=a).sort((n,o)=>n-o);if(this.algo==="FCFS")d.push(...t);else if(this.algo==="SSTF"){let n=[...t],o=a;for(;n.length>0;)n.sort((r,p)=>Math.abs(r-o)-Math.abs(p-o)),o=n.shift(),d.push(o)}else this.algo==="SCAN"?this.direction==="down"?(d.push(...c),c.length>0&&u.length>0&&d.push(0),d.push(...u)):(d.push(...u),u.length>0&&c.length>0&&d.push(i),d.push(...c)):this.algo==="C-SCAN"?this.direction==="down"?(d.push(...c),u.length>0&&(d.push(0),d.push(i),u.sort((n,o)=>o-n),d.push(...u))):(d.push(...u),c.length>0&&(d.push(i),d.push(0),c.sort((n,o)=>n-o),d.push(...c))):this.algo==="LOOK"?this.direction==="down"?(d.push(...c),d.push(...u)):(d.push(...u),d.push(...c)):this.algo==="C-LOOK"&&(this.direction==="down"?(d.push(...c),u.sort((n,o)=>o-n),d.push(...u)):(d.push(...u),c.sort((n,o)=>n-o),d.push(...c)));const l=[];for(let n=1;n<d.length;n++){const o=Math.abs(d[n]-d[n-1]);l.push({a:d[n-1],b:d[n],d:o}),s+=o}this.render(this.algo,d,s,l)},render(e,t,a,i=[]){const d=document.getElementById("w16-canvas"),s=document.getElementById("w16-summary"),c=document.getElementById("w16-handwritten");if(!d)return;s&&(s.innerHTML=`
        Algorithm: <strong style="color:var(--color-cyan);">${e}</strong> &nbsp;|&nbsp;
        Direction: <strong style="color:var(--text-primary);">${this.direction.toUpperCase()}</strong> &nbsp;|&nbsp;
        Total Head Movement: <strong style="color:var(--color-amber); font-size:1.15rem;">${a} cylinders</strong><br>
        <span style="font-size:0.85rem; color:var(--text-secondary);">Order: ${t.join(" &rarr; ")}</span>
      `);const u=660,l=Math.max(220,42+t.length*18),n=(u-70)/Math.max(1,this.cylinders-1),o=(l-46)/Math.max(1,t.length-1);let r=`<svg viewBox="0 0 ${u} ${l}" style="width:100%; max-width:680px; display:block;">`;r+=`<line x1="35" y1="22" x2="${u-35}" y2="22" stroke="var(--border-light)" stroke-width="2" />`,r+='<text x="35" y="15" fill="var(--text-secondary)" font-size="10.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">0</text>',r+=`<text x="${u-35}" y="15" fill="var(--text-secondary)" font-size="10.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">${this.cylinders-1}</text>`;let p=t.map((h,m)=>{const v=35+h*n,f=32+m*o;return`${v},${f}`}).join(" ");if(r+=`<polyline points="${p}" fill="none" stroke="var(--color-cyan)" stroke-width="2.2" />`,t.forEach((h,m)=>{const v=35+h*n,f=32+m*o,g=m===0;r+=`<circle cx="${v}" cy="${f}" r="${g?5:4}" fill="${g?"var(--color-amber)":"var(--color-cyan)"}" stroke="var(--bg-deep)" stroke-width="1"/>`,r+=`<text x="${v+(v>u-85?-10:8)}" y="${f+3}" fill="${g?"var(--color-amber)":"var(--text-primary)"}" font-size="9.5" font-weight="700" text-anchor="${v>u-85?"end":"start"}" font-family="var(--font-mono)">${g?"Head="+h:h}</text>`}),r+="</svg>",d.innerHTML=r,c){const h=i.map(v=>`|${v.a} &minus; ${v.b}|`).join(" + "),m=i.map(v=>v.d).join(" + ");c.innerHTML=`
        <div class="hw-title"><span>✍️ Seek Distance Calculation (As Written By Hand)</span><span>${e} | Head=${this.head}</span></div>
        <span class="hw-step">Total Seek = ${h||"0"}</span>
        <span class="hw-step">           = ${m||"0"} = <span class="hw-ans">${a} cylinders</span></span>
      `}}};window.W0_DualModeSimulator=L;window.W1_StateMachine=H;window.W2_ForkVisualizer=M;window.W2B_AmdahlLab=P;window.W3_CPUScheduler=C;window.W4_ExpAveragingLab=E;window.W4B_AgingLab=S;window.W5_RaceCondition=D;window.W6_BoundedBuffer=k;window.W7_CriticalSection=O;window.W8_Semaphore=R;window.W10_DiningPhilosophers=U;window.W11_CoffmanRAG=F;window.W12_Bankers=K;window.W12_DeadlockRecovery=W;window.W13_MemoryAlloc=B;window.W14_PagingTranslator=T;window.W15_PageReplacement=A;window.W16_DiskScheduling=$;window.W17_InodeFileSystem=N;window.W18_IODMAModel=_;window.W19_AccessMatrix=z;function G(e){if(!e)return;const t=e.ownerDocument||document;e.querySelectorAll(".formula-display").forEach((i,d)=>{if(i.querySelector(".formula-sandbox"))return;const s=i.textContent||"",c=t.createElement("div");c.className="formula-sandbox";const u=(l,n,o,r,p,h)=>{const m=t.createElement("div");m.className="play-ctrl";const v=t.createElement("label");v.textContent=l;const f=t.createElement("input");f.type="range",f.className="play-range",f.min=n,f.max=o,f.step=r,f.value=p;const g=t.createElement("input");return g.type="number",g.className="play-num",g.min=n,g.max=o,g.step=r,g.value=p,f.addEventListener("input",()=>{g.value=f.value,h()}),g.addEventListener("input",()=>{const y=parseFloat(g.value);isNaN(y)||(f.value=y,h())}),m.appendChild(v),m.appendChild(f),m.appendChild(g),{ctrl:m,num:g}};if(/Amdahl/i.test(s)){let p=function(){const m=+(Math.max(1,Math.min(100,parseFloat(o.num.value)||25))/100).toFixed(2),v=+(1-m).toFixed(2),f=Math.max(1,Math.min(64,parseInt(r.num.value,10)||4)),g=v/f,y=m+g,x=1/y,w=1/m;n.innerHTML=`
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Amdahl's Law)</span><span>S=${m.toFixed(2)}, N=${f}</span></div>
              <span class="hw-step">Speedup &le; 1 / [ ${m.toFixed(2)} + (1 &minus; ${m.toFixed(2)}) / ${f} ]</span>
              <span class="hw-step">       = 1 / [ ${m.toFixed(2)} + ${v.toFixed(2)} / ${f} ] = 1 / [ ${m.toFixed(2)} + <span class="hw-sub">${g.toFixed(4)}</span> ] = 1 / ${y.toFixed(4)} = <span class="hw-ans">${x.toFixed(2)}&times;</span></span>
              <span class="hw-step">Max Cap (N &rarr; &infin;) = 1 / S = 1 / ${m.toFixed(2)} = <span class="hw-sub">${w.toFixed(2)}&times;</span></span>
            `};const l=t.createElement("div");l.className="play-controls-bar";const n=t.createElement("div");n.className="handwritten-sheet";const o=u("Serial S (%):",1,100,1,25,()=>p()),r=u("Cores N:",1,64,1,4,()=>p());l.appendChild(o.ctrl),l.appendChild(r.ctrl),c.appendChild(l),c.appendChild(n),i.appendChild(c),p()}else if(/n\+1.*t.*n/i.test(s)&&!/t_?n-1/i.test(s)){let h=function(){const m=Math.max(0,Math.min(1,parseFloat(o.num.value)||0)),v=parseFloat(r.num.value)||6,f=parseFloat(p.num.value)||10,g=+(1-m).toFixed(2),y=m*v,x=g*f,w=y+x;n.innerHTML=`
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Exponential Burst Prediction)</span><span>&alpha;=${m.toFixed(2)}</span></div>
              <span class="hw-step">&tau;<sub>n+1</sub> = &alpha;&middot;t<sub>n</sub> + (1 &minus; &alpha;)&middot;&tau;<sub>n</sub></span>
              <span class="hw-step">    = ${m.toFixed(2)}&times;(${v}) + ${g.toFixed(2)}&times;(${f}) = <span class="hw-sub">${y.toFixed(2)}</span> + <span class="hw-sub">${x.toFixed(2)}</span> = <span class="hw-ans">${w.toFixed(2)} ms</span></span>
            `};const l=t.createElement("div");l.className="play-controls-bar";const n=t.createElement("div");n.className="handwritten-sheet";const o=u("Alpha (α):",0,1,.05,.5,()=>h()),r=u("Actual t_n (ms):",1,50,1,6,()=>h()),p=u("Prev Pred τ_n (ms):",1,50,1,10,()=>h());l.appendChild(o.ctrl),l.appendChild(r.ctrl),l.appendChild(p.ctrl),c.appendChild(l),c.appendChild(n),i.appendChild(c),h()}else if(/AgingInterval/i.test(s)){let h=function(){const m=parseInt(o.num.value,10)||10,v=parseInt(r.num.value,10)||0,f=Math.max(1,parseInt(p.num.value,10)||15),g=Math.floor(v/f),y=Math.max(0,m-g);n.innerHTML=`
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Aging)</span><span>0 = Top Priority</span></div>
              <span class="hw-step">Priority(t) = max(0, ${m} &minus; &lfloor;${v} / ${f}&rfloor;) = max(0, ${m} &minus; <span class="hw-sub">${g}</span>) = <span class="hw-ans">${y}</span></span>
            `};const l=t.createElement("div");l.className="play-controls-bar";const n=t.createElement("div");n.className="handwritten-sheet";const o=u("Init Prio:",1,40,1,10,()=>h()),r=u("Wait (min):",0,200,5,45,()=>h()),p=u("Interval (min):",1,60,1,15,()=>h());l.appendChild(o.ctrl),l.appendChild(r.ctrl),l.appendChild(p.ctrl),c.appendChild(l),c.appendChild(n),i.appendChild(c),h()}else if(/m-bit Logical Address Space/i.test(s)){let p=function(){const h=Math.max(4,Math.min(32,parseInt(o.num.value,10)||16)),m=Math.max(1,Math.min(h,parseInt(r.num.value,10)||10)),v=h-m,f=Math.pow(2,m),g=Math.pow(2,v);n.innerHTML=`
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Paging Address Split)</span><span>2<sup>${h}</sup> B space</span></div>
              <span class="hw-step">&bull; Page Size = 2<sup>n</sup> = 2<sup>${m}</sup> = <span class="hw-sub">${f.toLocaleString()} bytes</span> (${f>=1024?f/1024+" KB":f+" B"})</span>
              <span class="hw-step">&bull; High Page Bits = m &minus; n = ${h} &minus; ${m} = <span class="hw-ans">${v} bits</span> (&rArr; ${g.toLocaleString()} max pages)</span>
            `};const l=t.createElement("div");l.className="play-controls-bar";const n=t.createElement("div");n.className="handwritten-sheet";const o=u("Logical Bits m:",8,32,1,16,()=>p()),r=u("Offset Bits n:",4,16,1,10,()=>p());l.appendChild(o.ctrl),l.appendChild(r.ctrl),c.appendChild(l),c.appendChild(n),i.appendChild(c),p()}else if(/EAT\s*=.*TLB\s*\+/i.test(s)){let h=function(){const m=Math.max(0,Math.min(100,parseFloat(o.num.value)||80)),v=m/100,f=1-v,g=parseFloat(r.num.value)||0,y=parseFloat(p.num.value)||100,x=g+y,w=g+2*y,q=v*x+f*w;n.innerHTML=`
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (TLB EAT)</span><span>Hit=${m}%</span></div>
              <span class="hw-step">EAT = ${v.toFixed(2)}(${g} + ${y}) + ${f.toFixed(2)}(${g} + 2&times;${y})</span>
              <span class="hw-step">    = ${v.toFixed(2)}(${x}) + ${f.toFixed(2)}(${w}) = ${(v*x).toFixed(2)} + ${(f*w).toFixed(2)} = <span class="hw-ans">${q.toFixed(2)} ns</span></span>
            `};const l=t.createElement("div");l.className="play-controls-bar";const n=t.createElement("div");n.className="handwritten-sheet";const o=u("TLB Hit α (%):",0,100,1,80,()=>h()),r=u("TLB ε (ns):",0,100,1,20,()=>h()),p=u("RAM Mem (ns):",10,500,10,100,()=>h());l.appendChild(o.ctrl),l.appendChild(r.ctrl),l.appendChild(p.ctrl),c.appendChild(l),c.appendChild(n),i.appendChild(c),h()}else if(/page_fault_time/i.test(s)){let h=function(){const m=Math.max(1,parseFloat(o.num.value)||1e3),v=1/m,f=parseFloat(r.num.value)||200,g=parseFloat(p.num.value)||8,y=g*1e6,x=(1-v)*f+v*y,w=(x/f).toFixed(1);n.innerHTML=`
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Demand Paging EAT)</span><span>Convert ${g} ms = ${y.toLocaleString()} ns!</span></div>
              <span class="hw-step">p = 1 / ${m.toLocaleString()} = ${v.toExponential(2)} ,  pft = ${g} &times; 10<sup>6</sup> = ${y.toLocaleString()} ns</span>
              <span class="hw-step">EAT = (1 &minus; ${v.toFixed(4)}) &times; ${f} + (${v.toFixed(4)}) &times; ${y.toLocaleString()}</span>
              <span class="hw-step">    = ${((1-v)*f).toFixed(2)} + ${(v*y).toFixed(1)} = <span class="hw-ans">${x.toFixed(1)} ns (${w}&times; slowdown!)</span></span>
            `};const l=t.createElement("div");l.className="play-controls-bar";const n=t.createElement("div");n.className="handwritten-sheet";const o=u("Fault Rate 1 in K (K=):",100,1e6,100,1e3,()=>h()),r=u("Mem Access ma (ns):",10,500,10,200,()=>h()),p=u("Swap Fault Time (ms):",1,20,1,8,()=>h());l.appendChild(o.ctrl),l.appendChild(r.ctrl),l.appendChild(p.ctrl),c.appendChild(l),c.appendChild(n),i.appendChild(c),h()}})}function V(e,t,a){return t?(function(s){if(e==="deck_02"){s.innerHTML="ModeBit = 1 (User Mode) -> Ring 3<br>ModeBit = 0 (Kernel Mode) -> Ring 0<br>Trap Vector = IVT[Interrupt_ID]<br>Privileged Violations: HLT, CLI, Direct I/O",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W0: DUAL-MODE HARDWARE & TRAP VECTOR MACHINE</div>
              <div class="sim-controls">
                <button class="btn-industrial" onclick="W0_DualModeSimulator.executeUser()">1. Safe User Instruction</button>
                <button class="btn-industrial danger" onclick="W0_DualModeSimulator.executeHLT()">2. Privileged HLT (Trap!)</button>
                <button class="btn-industrial danger" onclick="W0_DualModeSimulator.executeCLI()">3. Privileged CLI (Trap!)</button>
                <button class="btn-industrial primary" onclick="W0_DualModeSimulator.executeSyscall()">4. INT 0x80 System Call</button>
                <button class="btn-industrial" onclick="W0_DualModeSimulator.executeTimer()">5. Timer Tick IRQ</button>
              </div>
            </div>
            <div class="sim-body">
              <div id="w0-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `,L.init();return}if(e==="deck_03"){s.innerHTML="5 Process States: New, Ready, Running, Waiting, Terminated<br>fork() returns: Child PID in parent, 0 in child<br>Total Procs = 2^n | Amdahl Speedup &le; 1 / [ S + (1&minus;S)/N ]",t.innerHTML=`
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W1: 5-STATE PROCESS LIFECYCLE MACHINE</div>
                <button class="btn-industrial" onclick="W1_StateMachine.currentState='New'; W1_StateMachine.init();">↺ Reset to New</button>
              </div>
              <div class="sim-body">
                <div id="w1-canvas" class="sim-canvas"></div>
                <div id="w1-actions" style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;"></div>
                <div id="w1-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-cyan);">Click any action button above to transition the active process state.</div>
              </div>
            </div>
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W2: PROCESS TREE & FORK() EXPONENTIATION</div>
                <div class="sim-controls">
                  <div class="play-ctrl">
                    <label>fork() calls (n):</label>
                    <input type="range" id="w2-range" class="play-range" min="1" max="5" value="${M.nForks}" oninput="W2_ForkVisualizer.update(this.value)" />
                    <input type="number" id="w2-num" class="play-num" min="1" max="5" value="${M.nForks}" oninput="W2_ForkVisualizer.update(this.value)" />
                  </div>
                </div>
              </div>
              <div class="sim-body">
                <div id="w2-stats" style="margin-bottom: 8px; font-size: 12px; color: var(--color-amber);"></div>
                <div id="w2-canvas" class="sim-canvas"></div>
                <div id="w2-hand" class="handwritten-sheet"></div>
              </div>
            </div>
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W2B: AMDAHL'S LAW PARALLEL SPEEDUP SANDBOX</div>
                <div class="sim-controls">
                  <button class="btn-industrial" onclick="W2B_AmdahlLab.update(25, 4)">Exam (S=0.25, N=4)</button>
                  <button class="btn-industrial" onclick="W2B_AmdahlLab.update(10, 16)">Scaled (S=0.10, N=16)</button>
                  <button class="btn-industrial" onclick="W2B_AmdahlLab.update(50, 8)">Bottleneck (S=0.50, N=8)</button>
                </div>
              </div>
              <div class="sim-body">
                <div class="play-controls-bar">
                  <div class="play-ctrl">
                    <label>Serial Fraction S (%):</label>
                    <input type="range" id="w2b-s-range" class="play-range" min="1" max="100" value="${P.sPct}" oninput="W2B_AmdahlLab.update(this.value, null)" />
                    <input type="number" id="w2b-s-num" class="play-num" min="1" max="100" value="${P.sPct}" oninput="W2B_AmdahlLab.update(this.value, null)" />
                  </div>
                  <div class="play-ctrl">
                    <label>CPU Cores (N):</label>
                    <input type="range" id="w2b-n-range" class="play-range" min="1" max="64" value="${P.cores}" oninput="W2B_AmdahlLab.update(null, this.value)" />
                    <input type="number" id="w2b-n-num" class="play-num" min="1" max="64" value="${P.cores}" oninput="W2B_AmdahlLab.update(null, this.value)" />
                  </div>
                </div>
                <div id="w2b-canvas"></div>
              </div>
            </div>
          </div>
        `,H.init(),M.init(),P.init();return}if(["deck_04","deck_05","deck_06","deck_07","deck_08"].includes(e)){let c="FCFS",u="standard",l="FCFS & Convoy Wind Tunnel";e==="deck_05"&&(c="SJF",u="standard",l="SJF Non-Preemptive Optimizer"),e==="deck_06"&&(c="SRTF",u="srtf",l="SRTF Preemptive Scheduler"),e==="deck_07"&&(c="Priority-Pre",u="priority",l="Preemptive Priority & Aging Lab"),e==="deck_08"&&(c="RR",u="rr",l="Round Robin Quantum Analyzer"),s.innerHTML="TAT = Completion Time - Arrival Time<br>WT = Turnaround Time - Burst Time<br>Avg WT = Sum(WT) / N";const n=e==="deck_05"?`
          <div class="sim-card" style="margin-top: 16px;">
            <div class="sim-header">
              <div class="sim-title">⚙️ W4: EXPONENTIAL AVERAGING CPU BURST PREDICTOR</div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Alpha (&alpha;):</label>
                  <input type="range" id="w4-alpha-r" class="play-range" min="0" max="1" step="0.05" value="${E.alpha}" oninput="W4_ExpAveragingLab.updateAlpha(this.value)" />
                  <input type="number" id="w4-alpha-n" class="play-num" min="0" max="1" step="0.05" value="${E.alpha}" oninput="W4_ExpAveragingLab.updateAlpha(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Initial &tau;<sub>0</sub>:</label>
                  <input type="number" class="play-num" min="0" max="100" value="${E.tau0}" oninput="W4_ExpAveragingLab.updateTau0(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Actual Bursts t:</label>
                  <input type="text" class="play-text" value="${E.bursts.join(", ")}" oninput="W4_ExpAveragingLab.updateBursts(this.value)" />
                </div>
              </div>
              <div id="w4-canvas"></div>
            </div>
          </div>
        `:"",o=e==="deck_07"?`
          <div class="sim-card" style="margin-top: 16px;">
            <div class="sim-header">
              <div class="sim-title">⚙️ W4B: STARVATION PREVENTION &amp; AGING ESCALATION</div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Initial Priority:</label>
                  <input type="range" id="w4b-ip-r" class="play-range" min="0" max="30" value="${S.initPrio}" oninput="W4B_AgingLab.update(this.value, null, null)" />
                  <input type="number" id="w4b-ip-n" class="play-num" min="0" max="40" value="${S.initPrio}" oninput="W4B_AgingLab.update(this.value, null, null)" />
                </div>
                <div class="play-ctrl">
                  <label>Wait Time:</label>
                  <input type="range" id="w4b-wt-r" class="play-range" min="0" max="200" step="5" value="${S.waitTime}" oninput="W4B_AgingLab.update(null, this.value, null)" />
                  <input type="number" id="w4b-wt-n" class="play-num" min="0" max="300" value="${S.waitTime}" oninput="W4B_AgingLab.update(null, this.value, null)" />
                </div>
                <div class="play-ctrl">
                  <label>Aging Interval:</label>
                  <input type="range" id="w4b-st-r" class="play-range" min="1" max="60" value="${S.agingStep}" oninput="W4B_AgingLab.update(null, null, this.value)" />
                  <input type="number" id="w4b-st-n" class="play-num" min="1" max="60" value="${S.agingStep}" oninput="W4B_AgingLab.update(null, null, this.value)" />
                </div>
              </div>
              <div id="w4b-canvas"></div>
            </div>
          </div>
        `:"";t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ ${l.toUpperCase()}</div>
              <div class="sim-controls">
                <select id="w3-algo" class="btn-industrial" onchange="W3_CPUScheduler.algorithm = this.value; W3_CPUScheduler.syncUI(); W3_CPUScheduler.calculate(false);">
                  <option value="FCFS" ${c==="FCFS"?"selected":""}>FCFS</option>
                  <option value="SJF" ${c==="SJF"?"selected":""}>SJF (Non-Preemptive)</option>
                  <option value="SRTF" ${c==="SRTF"?"selected":""}>SRTF (Preemptive SJF)</option>
                  <option value="Priority-NonPre" ${c==="Priority-NonPre"?"selected":""}>Priority (Non-Preemptive)</option>
                  <option value="Priority-Pre" ${c==="Priority-Pre"?"selected":""}>Priority (Preemptive)</option>
                  <option value="RR" ${c==="RR"?"selected":""}>Round Robin (RR)</option>
                </select>
                <button class="btn-industrial" onclick="W3_CPUScheduler.loadExample('standard')">Slide FCFS</button>
                <button class="btn-industrial" onclick="W3_CPUScheduler.loadExample('srtf')">Slide SRTF</button>
                <button class="btn-industrial" onclick="W3_CPUScheduler.loadExample('priority')">Slide Priority</button>
                <button class="btn-industrial" onclick="W3_CPUScheduler.loadExample('rr')">Slide RR (q=4)</button>
                <button class="btn-industrial primary" onclick="W3_CPUScheduler.addProcess()">+ Add Process</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar" id="w3-play-bar">
                <div class="play-ctrl">
                  <label>Play Process:</label>
                  <select id="w3-sl-proc" class="play-num" style="width:68px;" onchange="W3_CPUScheduler.selectProc(this.value)"></select>
                </div>
                <div class="play-ctrl">
                  <label>AT:</label>
                  <input type="range" id="w3-sl-at-r" class="play-range" style="width:78px;" min="0" max="20" value="0" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'at',this.value,true)" />
                  <input type="number" id="w3-sl-at-n" class="play-num" style="width:52px;" min="0" max="60" value="0" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'at',this.value,true)" />
                </div>
                <div class="play-ctrl">
                  <label>BT:</label>
                  <input type="range" id="w3-sl-bt-r" class="play-range" style="width:78px;" min="1" max="30" value="24" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'bt',this.value,true)" />
                  <input type="number" id="w3-sl-bt-n" class="play-num" style="width:52px;" min="1" max="60" value="24" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'bt',this.value,true)" />
                </div>
                <div class="play-ctrl">
                  <label>Priority:</label>
                  <input type="range" id="w3-sl-p-r" class="play-range" style="width:72px;" min="1" max="10" value="3" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'p',this.value,true)" />
                  <input type="number" id="w3-sl-p-n" class="play-num" style="width:50px;" min="1" max="20" value="3" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'p',this.value,true)" />
                </div>
                <div class="play-ctrl" id="w3-q-ctrl" style="display:${c==="RR"?"inline-flex":"none"};">
                  <label>Quantum Q:</label>
                  <input type="range" id="w3-q-range" class="play-range" style="width:72px;" min="1" max="20" value="4" oninput="W3_CPUScheduler.setQuantum(this.value)" />
                  <input type="number" id="w3-quantum" class="play-num" style="width:52px;" min="1" max="30" value="4" oninput="W3_CPUScheduler.setQuantum(this.value)" />
                </div>
              </div>

              <div style="font-size: 11px; font-weight: 700; color: var(--color-cyan); margin-bottom: 4px;">GANTT CHART TIMELINE:</div>
              <div class="sim-canvas" id="w3-gantt" style="min-height: 98px;"></div>

              <div style="font-size: 11px; font-weight: 700; color: var(--color-cyan); margin: 12px 0 4px;">EDITABLE EXAM EXECUTION TABLE (Change AT / BT / Priority directly or via sliders above):</div>
              <div style="overflow-x: auto;">
                <table class="data-table">
                  <thead>
                    <tr><th>Process</th><th>Arrival (AT)</th><th>Burst (BT)</th><th>Priority</th><th>Completion (CT)</th><th>TAT (CT-AT)</th><th>WT (TAT-BT)</th><th>RT</th><th></th></tr>
                  </thead>
                  <tbody id="w3-table-body"></tbody>
                </table>
              </div>
              <div id="w3-summary" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w3-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
          ${n}
          ${o}
        `,C.loadExample(u),C.algorithm=c,C.syncUI(),C.calculate(!1),e==="deck_05"&&E.init(),e==="deck_07"&&S.init();return}if(e==="deck_09"){s.innerHTML="count++ -> LOAD R1, count; ADD R1, #1; STORE count, R1<br>count-- -> LOAD R2, count; SUB R2, #1; STORE count, R2<br>Result: 4 or 6 instead of 5",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W5: RACE CONDITION COLLIDER (REGISTER-LEVEL INTERLEAVING)</div>
              <div class="sim-controls">
                <div class="play-ctrl">
                  <label>Step:</label>
                  <input type="range" id="w5-step-r" class="play-range" style="width:90px;" min="0" max="6" value="0" oninput="W5_RaceCondition.setStep(this.value)" />
                  <input type="number" id="w5-step-n" class="play-num" style="width:48px;" min="0" max="6" value="0" oninput="W5_RaceCondition.setStep(this.value)" />
                </div>
                <button class="btn-industrial primary" onclick="W5_RaceCondition.next()">NEXT STEP</button>
                <button class="btn-industrial" onclick="W5_RaceCondition.reset()">RESET</button>
              </div>
            </div>
            <div class="sim-body">
              <div style="overflow-x: auto;">
                <table class="data-table">
                  <thead><tr><th>Step</th><th>Actor</th><th>Assembly Instruction</th><th>Reg 1</th><th>Reg 2</th><th>Shared Counter</th></tr></thead>
                  <tbody id="w5-table-body"></tbody>
                </table>
              </div>
              <div id="w5-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
            </div>
          </div>
        `,D.init();return}if(e==="deck_10"){s.innerHTML="flag[i] = true; turn = j;<br>while (flag[j] && turn == j);<br>flag[i] = false;",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W7: PETERSON'S ALGORITHM TRACER (2 PROCESSES)</div>
              <div class="sim-controls">
                <div class="play-ctrl">
                  <label>Step:</label>
                  <input type="range" id="w7-step-r" class="play-range" style="width:90px;" min="0" max="6" value="0" oninput="W7_CriticalSection.setStep(this.value)" />
                  <input type="number" id="w7-step-n" class="play-num" style="width:48px;" min="0" max="6" value="0" oninput="W7_CriticalSection.setStep(this.value)" />
                </div>
                <button class="btn-industrial primary" onclick="W7_CriticalSection.nextStep()">STEP PETERSON</button>
                <button class="btn-industrial" onclick="W7_CriticalSection.reset()">RESET</button>
              </div>
            </div>
            <div class="sim-body">
              <div style="overflow-x: auto;">
                <table class="data-table">
                  <thead><tr><th>Step</th><th>P0 Code</th><th>P1 Code</th><th>flag[0]</th><th>flag[1]</th><th>turn</th><th>Critical Section</th></tr></thead>
                  <tbody id="w7-table-body"></tbody>
                </table>
              </div>
              <div id="w7-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
            </div>
          </div>
        `,O.init();return}if(e==="deck_11"){s.innerHTML="wait(S): while(S<=0); S--;<br>signal(S): S++;<br>Bounded Buffer: mutex=1, empty=N, full=0",t.innerHTML=`
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W6: BOUNDED BUFFER CIRCULAR PRODUCER-CONSUMER</div>
                <div class="sim-controls">
                  <div class="play-ctrl">
                    <label>Slots N:</label>
                    <input type="range" id="w6-sz-r" class="play-range" style="width:72px;" min="4" max="10" value="${k.size}" oninput="W6_BoundedBuffer.setSize(this.value)" />
                    <input type="number" id="w6-sz-n" class="play-num" style="width:48px;" min="4" max="10" value="${k.size}" oninput="W6_BoundedBuffer.setSize(this.value)" />
                  </div>
                  <button class="btn-industrial primary" onclick="W6_BoundedBuffer.produce()">PRODUCE ITEM</button>
                  <button class="btn-industrial" onclick="W6_BoundedBuffer.consume()">CONSUME ITEM</button>
                  <button class="btn-industrial" onclick="W6_BoundedBuffer.reset()">RESET</button>
                </div>
              </div>
              <div class="sim-body">
                <div id="w6-canvas" class="sim-canvas"></div>
                <div id="w6-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-cyan);"></div>
                <div id="w6-hand" class="handwritten-sheet"></div>
              </div>
            </div>
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W8: COUNTING SEMAPHORE DISPATCHER</div>
                <div class="sim-controls">
                  <div class="play-ctrl">
                    <label>Initial S:</label>
                    <input type="range" id="w8-init-r" class="play-range" style="width:72px;" min="0" max="8" value="${R.initValue}" oninput="W8_Semaphore.setInitial(this.value)" />
                    <input type="number" id="w8-init-n" class="play-num" style="width:48px;" min="0" max="8" value="${R.initValue}" oninput="W8_Semaphore.setInitial(this.value)" />
                  </div>
                  <button class="btn-industrial primary" onclick="W8_Semaphore.wait()">CALL wait() (P)</button>
                  <button class="btn-industrial" onclick="W8_Semaphore.signal()">CALL signal() (V)</button>
                  <button class="btn-industrial" onclick="W8_Semaphore.reset()">RESET</button>
                </div>
              </div>
              <div class="sim-body">
                <div style="font-size: 13px; font-family: var(--font-mono); margin-bottom: 6px;">
                  Semaphore Value: <strong id="w8-val" style="color:var(--color-cyan); font-size: 18px;">1</strong> | 
                  Blocked Queue: <span id="w8-queue" style="color:var(--color-amber);">[]</span>
                </div>
                <div id="w8-narr" style="font-size: 12px; color: var(--text-secondary);"></div>
              </div>
            </div>
          </div>
        `,k.init(),R.init();return}if(e==="deck_12"){s.innerHTML="5 Philosophers, 5 Chopsticks<br>Circular Wait: Everyone grabs left -> DEADLOCK!<br>Fix: Max 4, Asymmetric pickup, or Monitor",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W10: DINING PHILOSOPHERS INTERACTIVE TABLE</div>
              <div class="sim-controls">
                <button class="btn-industrial danger" onclick="W10_DiningPhilosophers.triggerDeadlock()">TRIGGER CIRCULAR DEADLOCK</button>
                <button class="btn-industrial" onclick="W10_DiningPhilosophers.reset()">RESET TABLE</button>
              </div>
            </div>
            <div class="sim-body">
              <div id="w10-canvas" class="sim-canvas"></div>
              <div id="w10-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-cyan);">Click any Philosopher circle (P0..P4) to toggle THINKING &harr; HUNGRY/EATING.</div>
            </div>
          </div>
        `,U.init();return}if(e==="deck_13"){s.innerHTML="4 Coffman Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait<br>Prevention: Invalidate at least one condition to guarantee zero deadlocks",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W11: COFFMAN CONDITIONS & DEADLOCK PREVENTION MATRIX</div>
            </div>
            <div class="sim-body">
              <div id="w11-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `,F.init();return}if(e==="deck_14"){s.innerHTML="Need = Max - Allocation<br>Safety Test: Work = Available; Finish[i] = false<br>Safe Sequence if all Finish[i] == true",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W12: BANKER'S ALGORITHM SAFETY CALCULATOR</div>
              <div class="sim-controls">
                <button class="btn-industrial primary" onclick="W12_Bankers.lastMsg=''; W12_Bankers.runSafety(false);">RUN SAFETY ALGORITHM</button>
                <button class="btn-industrial" onclick="W12_Bankers.reset()">↺ RESET DEFAULT</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Custom Request Process:</label>
                  <select id="w12-req-p" class="play-num" style="width:68px;" onchange="W12_Bankers.setRequestParam(this.value,null,null)">
                    <option value="0">P0</option><option value="1" selected>P1</option><option value="2">P2</option><option value="3">P3</option><option value="4">P4</option>
                  </select>
                </div>
                <div class="play-ctrl">
                  <label>Req (A B C):</label>
                  <input type="number" id="w12-req-0" class="play-num" style="width:46px;" min="0" max="20" value="1" oninput="W12_Bankers.setRequestParam(null,0,this.value)" />
                  <input type="number" id="w12-req-1" class="play-num" style="width:46px;" min="0" max="20" value="0" oninput="W12_Bankers.setRequestParam(null,1,this.value)" />
                  <input type="number" id="w12-req-2" class="play-num" style="width:46px;" min="0" max="20" value="2" oninput="W12_Bankers.setRequestParam(null,2,this.value)" />
                </div>
                <button class="btn-industrial primary" onclick="W12_Bankers.testRequest()">TEST REQUEST</button>
              </div>
              <div style="overflow-x: auto;">
                <table class="data-table">
                  <thead><tr><th>Process</th><th>Allocation (A B C)</th><th>Max (A B C)</th><th>Need (Max&minus;Alloc)</th><th>Available (A B C)</th></tr></thead>
                  <tbody id="w12-table-body"></tbody>
                </table>
              </div>
              <div id="w12-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w12-trace" style="margin-top: 8px; font-family: var(--font-mono); color: var(--color-emerald); font-size: 12px;"></div>
              <div id="w12-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
        `,K.init();return}if(e==="deck_15"){s.innerHTML="Wait-For Graph: P_i -> P_j if P_i is waiting for P_j to release a resource<br>Recovery: Abort processes or Preempt resources based on minimum cost",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W12B: WAIT-FOR GRAPH CYCLE DETECTION & RECOVERY</div>
            </div>
            <div class="sim-body">
              <div id="w12-recovery-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `,W.init();return}if(e==="deck_16"){s.innerHTML="First-Fit: Allocate first hole big enough<br>Best-Fit: Allocate smallest hole big enough<br>Worst-Fit: Allocate largest hole",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W13: CONTIGUOUS PARTITION ALLOCATOR</div>
              <div class="sim-controls">
                <button class="btn-industrial" onclick="W13_MemoryAlloc.run('first')">FIRST-FIT</button>
                <button class="btn-industrial" onclick="W13_MemoryAlloc.run('best')">BEST-FIT</button>
                <button class="btn-industrial" onclick="W13_MemoryAlloc.run('worst')">WORST-FIT</button>
                <button class="btn-industrial" onclick="W13_MemoryAlloc.reset()">RESET</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Hole Sizes (KB):</label>
                  <input type="text" id="w13-holes" class="play-text" value="${B.holeSizes.join(", ")}" oninput="W13_MemoryAlloc.updateHoles(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Process Sizes (KB):</label>
                  <input type="text" id="w13-procs" class="play-text" value="${B.procSizes.join(", ")}" oninput="W13_MemoryAlloc.updateProcs(this.value)" />
                </div>
              </div>
              <div id="w13-canvas" class="sim-canvas"></div>
              <div id="w13-summary" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w13-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
        `,B.run("first");return}if(e==="deck_17"){s.innerHTML="p = Address / Page_Size; d = Address % Page_Size<br>EAT = alpha*(eps + m) + (1-alpha)*(eps + 2m)",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W14: PAGING ADDRESS TRANSLATOR &amp; TLB EAT LAB</div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Logical Addr:</label>
                  <input type="range" id="w14-la-r" class="play-range" min="0" max="8191" value="3085" oninput="W14_PagingTranslator.setLA(this.value)" />
                  <input type="number" id="w14-la" class="play-num" style="width:74px;" min="0" max="65535" value="3085" oninput="W14_PagingTranslator.setLA(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Page Size:</label>
                  <select id="w14-ps" class="play-num" style="width:118px;" onchange="W14_PagingTranslator.translate()">
                    <option value="256">256 B</option>
                    <option value="512">512 B</option>
                    <option value="1024" selected>1 KB (1024 B)</option>
                    <option value="2048">2 KB (2048 B)</option>
                    <option value="4096">4 KB (4096 B)</option>
                  </select>
                </div>
              </div>
              <div class="panel-chamfer" style="padding: 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; font-family: var(--font-mono); margin-bottom: 8px;">
                <div>Page Number (p): <strong id="w14-p" style="color:var(--color-cyan);">-</strong></div>
                <div>Offset (d): <strong id="w14-d" style="color:var(--color-amber);">-</strong></div>
                <div>Frame (f): <strong id="w14-frame" style="color:var(--color-emerald);">-</strong></div>
                <div>Physical Addr (PA): <strong id="w14-pa" style="color:var(--text-primary);">-</strong></div>
              </div>
              <div id="w14-narr" style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;"></div>

              <div class="play-controls-bar" style="margin-top: 14px;">
                <div class="play-ctrl">
                  <label>TLB Hit &alpha; (%):</label>
                  <input type="range" id="w14-a-r" class="play-range" style="width:82px;" min="0" max="100" value="${T.hitRatio}" oninput="W14_PagingTranslator.setEAT(this.value, null, null)" />
                  <input type="number" id="w14-a-n" class="play-num" style="width:54px;" min="0" max="100" value="${T.hitRatio}" oninput="W14_PagingTranslator.setEAT(this.value, null, null)" />
                </div>
                <div class="play-ctrl">
                  <label>TLB &epsilon; (ns):</label>
                  <input type="range" id="w14-e-r" class="play-range" style="width:74px;" min="0" max="100" value="${T.tlbNs}" oninput="W14_PagingTranslator.setEAT(null, this.value, null)" />
                  <input type="number" id="w14-e-n" class="play-num" style="width:54px;" min="0" max="200" value="${T.tlbNs}" oninput="W14_PagingTranslator.setEAT(null, this.value, null)" />
                </div>
                <div class="play-ctrl">
                  <label>RAM m (ns):</label>
                  <input type="range" id="w14-m-r" class="play-range" style="width:74px;" min="10" max="500" step="10" value="${T.memNs}" oninput="W14_PagingTranslator.setEAT(null, null, this.value)" />
                  <input type="number" id="w14-m-n" class="play-num" style="width:58px;" min="10" max="1000" value="${T.memNs}" oninput="W14_PagingTranslator.setEAT(null, null, this.value)" />
                </div>
              </div>
              <div id="w14-eat-hand"></div>
            </div>
          </div>
        `,T.translate();return}if(e==="deck_18"){s.innerHTML="FIFO: Belady's Anomaly (more frames -> more faults!)<br>LRU: Least Recently Used<br>OPT: Optimal future replacement",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W15: PAGE REPLACEMENT SIMULATOR (PLAY FRAMES &amp; REF STRING)</div>
              <div class="sim-controls">
                <button class="btn-industrial" onclick="W15_PageReplacement.run('FIFO')">FIFO</button>
                <button class="btn-industrial" onclick="W15_PageReplacement.run('LRU')">LRU</button>
                <button class="btn-industrial" onclick="W15_PageReplacement.run('OPT')">OPT</button>
                <button class="btn-industrial" onclick="W15_PageReplacement.loadPreset('slide18')">Slide 18 Classic</button>
                <button class="btn-industrial primary" onclick="W15_PageReplacement.loadPreset('belady')">Belady Paradox (3 vs 4)</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Frames F:</label>
                  <input type="range" id="w15-f-r" class="play-range" style="width:82px;" min="1" max="6" value="${A.nFrames}" oninput="W15_PageReplacement.setFrames(this.value)" />
                  <input type="number" id="w15-f-n" class="play-num" style="width:48px;" min="1" max="6" value="${A.nFrames}" oninput="W15_PageReplacement.setFrames(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Ref String:</label>
                  <input type="text" id="w15-refs" class="play-text" style="min-width:250px;" value="${A.refString.join(",")}" oninput="W15_PageReplacement.setRefs(this.value)" />
                </div>
              </div>
              <div id="w15-grid" class="sim-canvas"></div>
              <div id="w15-summary" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w15-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
        `,A.run("FIFO");return}if(e==="deck_19"){s.innerHTML="Seek Time: Cylinder head movement<br>Algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W16: DISK HEAD SEEK SCHEDULER</div>
              <div class="sim-controls">
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('FCFS')">FCFS</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('SSTF')">SSTF</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('SCAN')">SCAN</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('C-SCAN')">C-SCAN</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('LOOK')">LOOK</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('C-LOOK')">C-LOOK</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.loadStandardExample()">Slide 19 (53)</button>
                <button class="btn-industrial primary" onclick="W16_DiskScheduling.loadReviewQueueExample()">Practice (143)</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Start Head:</label>
                  <input type="range" id="w16-head-r" class="play-range" style="width:90px;" min="0" max="${$.cylinders-1}" value="${$.head}" oninput="W16_DiskScheduling.updateParam('head', this.value)" />
                  <input type="number" id="w16-head-n" class="play-num" style="width:62px;" min="0" max="9999" value="${$.head}" oninput="W16_DiskScheduling.updateParam('head', this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Cylinders:</label>
                  <input type="number" id="w16-cyl-n" class="play-num" style="width:64px;" min="20" max="10000" value="${$.cylinders}" oninput="W16_DiskScheduling.updateParam('cyl', this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Direction:</label>
                  <select id="w16-dir" class="play-num" style="width:86px;" onchange="W16_DiskScheduling.updateParam('dir', this.value)">
                    <option value="down" ${$.direction==="down"?"selected":""}>Down (&larr; 0)</option>
                    <option value="up" ${$.direction==="up"?"selected":""}>Up (&rarr; max)</option>
                  </select>
                </div>
                <div class="play-ctrl">
                  <label>Queue:</label>
                  <input type="text" id="w16-queue" class="play-text" value="${$.queue.join(", ")}" oninput="W16_DiskScheduling.updateParam('queue', this.value)" />
                </div>
              </div>
              <div id="w16-canvas" class="sim-canvas"></div>
              <div id="w16-summary" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w16-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
        `,$.run("FCFS");return}if(e==="deck_20"){s.innerHTML="UNIX Inode: 12 Direct Pointers, 1 Single Indirect, 1 Double Indirect, 1 Triple Indirect<br>Block Size: 4 KB",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W17: INODE MULTI-LEVEL BLOCK TRAVERSAL</div>
            </div>
            <div class="sim-body">
              <div id="w17-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `,N.init();return}if(e==="deck_21"){s.innerHTML="Polling: CPU busy-waits<br>Interrupt-Driven: 1 interrupt per byte<br>DMA: 1 interrupt per block (bypasses CPU)",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W18: I/O MANAGEMENT: POLLING vs INTERRUPTS vs DMA</div>
            </div>
            <div class="sim-body">
              <div id="w18-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `,_.init();return}if(e==="deck_22"){s.innerHTML="Access Matrix: Rows = Domains, Columns = Objects<br>Access Control Lists (ACLs) per Object vs Capability Lists per Domain",t.innerHTML=`
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W19: ACCESS MATRIX SECURITY & DOMAIN FIREWALL</div>
            </div>
            <div class="sim-body">
              <div id="w19-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `,z.init();return}})(a||{innerHTML:""}):void 0}export{G as a,j as b,V as m};
