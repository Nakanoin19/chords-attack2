<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown';
    import json from './lib/chords.json'
    import Tailwind from './lib/Tailwind.svelte'
    import pnk from './assets/pnk.png'
    import face from './assets/pnk_face.png'
    import md from './lib/chords.md?raw'
    import { onMount } from 'svelte';

    const octaves = 3;

    let keys = [...Array(12 * octaves + 1)].map((_, i) => i)

    let scales = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]

    let cbase_i: number, ctype_i: number

    interface Histry {
        chord: string
        tf: boolean
    }

    let hist: Histry[] = new Array()

    let chord = ""
    let component: number[] = []
    let advice_f = ""
    let tf = ""
    let advice = ""
    let now = 0
    let result = 0

    let game = false

    let selected: boolean[] = new Array(12 * octaves + 1)

    let finish_dialog: HTMLDialogElement
    let start_d: HTMLDialogElement
    let chordlist: HTMLDialogElement

    onMount(() => {
        start_d.show()
    })

    function start() {
        game = true
        hist = []
        result = 0
        newquestion()
        start_d.close()
    }
    
    function newquestion() {
        cbase_i = Math.floor(Math.random() * 12)
        ctype_i = Math.floor(Math.random() * (json.chords.length + 1))
        chord = scales[cbase_i] + json.chords[ctype_i].name
        component = json.chords[ctype_i].component.map((c) => (c + cbase_i) % 12)
        advice_f = json.chords[ctype_i].advice
        tf = ""
        advice = ""
        now++

        for (let key_elem of document.querySelectorAll(".keyboard")) {
            key_elem.removeAttribute("disabled")
        }
    }

    function onclick(keynum: number) {
        selected[keynum] = selected[keynum] ? false : true
        if (selected[keynum]) {
            document.querySelector("#key" + keynum + " span").setAttribute("id", "selected")
        } else {
            document.querySelector("#key" + keynum + " span").removeAttribute("id")
        }
    }

    function lock() {
        let tof = true

        let s_scales: boolean[] = Array(12).fill(false)
        for (let selec in selected) {
            if (!s_scales[Number(selec) % 12] && selected[selec]) {
                s_scales[Number(selec) % 12] = true
            }
        }

        for (let s_scale in s_scales) {
            if (s_scales[s_scale] && !component.includes(Number(s_scale))) {
                tof = false
                break
            }
            if (!s_scales[s_scale] && component.includes(Number(s_scale))) {
                tof = false
                break
            }
        }

        
        if (tof) {
            tf = '<span class="text-blue-600">circle</span>'
            advice = "正解! おめでとう〜"
        } else {
            tf = '<span class="text-red-600">close</span>'
            advice = advice_f
        }

        selected.fill(false)
        for (let key_elem of document.querySelectorAll(".keyboard span")) {
            key_elem.removeAttribute("id")
        }

        button_disabled()

        hist.push({chord: chord, tf: tof})
    }

    function finish() {
        game = false
        tf = ""
        advice = ""
        chord = ""
        now = 0
        component = []
        for (let hist_i of hist) {
            if (hist_i.tf) {
                result++
            }
        }
        button_disabled()
        finish_dialog.show()

        finish_dialog.addEventListener("close", () => {
            start_d.show()
        })
    }

    function button_disabled() {
        for (let key_elem of document.querySelectorAll(".keyboard")) {
            key_elem.setAttribute("disabled", "")
        }
    }
</script>

<svelte:head>
	<title>中院先輩と学ぶコード基礎</title>
</svelte:head>

<style>
    @tailwind utilities;
    @tailwind components;

    .material-symbols-outlined {
        font-size: inherit;
        font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' inherit;
        @apply inline-flex;
    }

    .whitekey:has(#selected) {
        @apply bg-sky-100;
    }

    .blackkey:has(#selected) {
        @apply bg-sky-950;
    }
</style>

<Tailwind />

<dialog bind:this={start_d} class="w-full h-full bg-sky-200 z-30 p-4">
    <div class="w-full h-full flex flex-col">
        <div class="grid grid-cols-5 my-auto">
            <div class="col-span-3 text-left flex flex-col gap-2">
                <p class="w-fit h-fit p-1 bg-neutral-800 text-white text-2xl font-black"><span class="text-xl">すべあな</span>学園</p>
                <div class="text-5xl flex-1 font-black flex flex-col gap-1">
                    <p>中院先輩<span class="text-4xl">と</span>学<span class="text-4xl">ぶ</span></p>
                    <p><span class="text-4xl">コード</span>基礎</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <button class="block bg-sky-600 text-white rounded p-2 hover:shadow active:shadow focus:shadow w-full" on:click={start}>はじめる</button>
                    <button class="block bg-sky-600 text-white rounded p-2 hover:shadow active:shadow focus:shadow w-full" on:click={() => chordlist.show()}>特殊なコード一覧</button>
                </div>
            </div>
            <div class="col-span-2 relative">
                <p>
                    <img src={pnk} class="w-full" />
                </p>
                <div class="absolute bottom-0 right-0 text-neutral-600">
                    <p>Illustrated by Marine Nakanoin</p>
                </div>
            </div>
        </div>
    </div>
</dialog>

<dialog bind:this={finish_dialog} class="w-full h-full bg-sky-200 z-30 p-4">
    <div class="flex flex-col w-full h-full">
        <div class="my-auto flex flex-col gap-4">
            <h1 class="font-black text-4xl">結果発表</h1>
            <h3 class="font-medium text-5xl">{result}<span class="text-2xl">/5</span></h3>
            <p>
                {#if result <= 2}
                    もう少し頑張ろう...
                {:else if result <= 4}
                    いい感じ
                {:else}
                    完全勝利!!! おめでとう!!
                {/if}
            </p>
            <p><button class="w-1/3 bg-sky-600 text-white rounded p-2 hover:shadow active:shadow focus:shadow" on:click={() => finish_dialog.close()}>おわる</button></p>
        </div>
    </div>
</dialog>

<dialog bind:this={chordlist} class="w-full h-full bg-white z-40 text-left">
    <button class="block fixed material-symbols-outlined top-4 left-4" on:click={() => chordlist.close()}>close</button>
    <div class="w-10/12 mx-auto p-4 prose prose-neutral"><SvelteMarkdown source={md} /></div>
</dialog>

<header class="flex flex-row text-4xl font-medium">
    <p class="w-20 h-20 flex flex-col bg-sky-600 text-white"><span class="m-auto">{now}</span></p>
    <p class="h-20 flex-1 text-left flex flex-col bg-sky-100"><span class="my-auto px-4">{chord}</span></p>
</header>

<main class="mt-8">
    <div class="flex divide-x divide-zinc-400 border border-zinc-400 w-fit h-fit mx-auto" id="keyboard">
        {#each keys as key}
            <button
                id="key{key}"
                class="keyboard block {[1, 4, 6, 9, 11].includes(key % 12) ? 'blackkey w-6 h-24 -ml-3 bg-neutral-800 z-20' : 'whitekey w-8 h-40 bg-white z-10'} {[2, 5, 7, 10].includes((key % 12)) || (key != 0 && key % 12 == 0) ? '-ml-3' : ''}"
                on:click={() => onclick(key)}
                disabled
            >
                <span></span>
            </button>
        {/each}
    </div>
    <p class="mt-4">
        {#if hist.length == 5}
            <button class="w-1/3 bg-sky-600 text-white rounded p-2 hover:shadow active:shadow focus:shadow" on:click={finish}>Finish</button>
        {:else if tf == ""}
            <button class="w-1/3 bg-sky-600 text-white rounded p-2 hover:shadow active:shadow focus:shadow" on:click={lock}>Lock</button>
        {:else}
            <button class="w-1/3 bg-sky-600 text-white rounded p-2 hover:shadow active:shadow focus:shadow" on:click={newquestion}>Next &gt;</button>
        {/if}
    </p>
    <div class="flex flex-row gap-4 items-center mx-auto bg-sky-100 p-4 mt-4 rounded">
        <p class="text-5xl"><span class="material-symbols-outlined">{@html tf}</span></p>
        <p class="flex-1">{advice}</p>
        <p><img class="w-16 rounded-full border-4 border-sky-400" src={face}></p>
    </div>
</main>

<p class="fixed text-sm text-neutral-600 bottom-2 right-2 z-50">&copy;2023 Piano Nakanoin(NITMC J2)</p>
