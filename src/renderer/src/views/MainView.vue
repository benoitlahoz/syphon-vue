<script lang="ts">
export default {
  name: 'MainView',
};
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const serverCanvases = ref<any[]>([]);
let rafId: number = -1;

onMounted(() => {});

const onCreateServer = () => {
  const index = serverCanvases.value.length;

  const win: Window = window.open(
    `/#/syphon-server/${index}`,
    `syphon_server_${index}`,
    'width=800,height=600',
  ) as Window;

  // const api = (window as any).api;
  // api.openSyphonWindow(index);

  serverCanvases.value.push({
    index,
    size: {
      width: 800,
      height: 600,
    },
    style: {
      background: 'black',
      width: '320px',
      height: '240px',
      marginTop: index > 0 ? '0.5rem' : '0',
    },
    win,
  });

  if (rafId === -1) {
    rafId = requestAnimationFrame(drawFrame);
  }
};

const drawFrame = (timestamp: number) => {
  for (const server of serverCanvases.value) {
    const index = server.index;
    const hue = (timestamp / (10 + Number(index) * 2)) % 360;
    const canvas: HTMLCanvasElement | null = document.getElementById(
      `canvas_${index}`,
    ) as HTMLCanvasElement | null;

    if (!canvas) continue;

    const width = canvas.width;
    const height = canvas.height;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#003300';
      ctx.font = 'bold 30px sans-serif';

      const str = `syphon_server_${index}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(str, canvas.width / 2, canvas.height / 2);

      if (server.win) {
        const windowCanvas = server.win.document.getElementsByTagName('canvas');
        if (windowCanvas.length > 0) {
          const windowCtx = windowCanvas[0].getContext('2d');
          if (windowCtx) {
            windowCtx.drawImage(canvas, 0, 0);
          }
        }
      }
    }
  }
  rafId = requestAnimationFrame(drawFrame);
};
</script>

<template lang="pug">
.app 
  .left 
    .title Clients
    div 
      button(
        style="margin: 0.5rem;"
      ) Create Client
  .right 
    .title Servers
    div
      button(
        style="margin: 0.5rem;"
        @click="onCreateServer"
      ) Create Server
    div(
      style="width: 100%; flex-grow: 1; display: flex; flex-direction: column; align-items: center; overflow-y: scroll; padding-bottom: 0.5rem;"
    )
      canvas(
        v-for="(canvasDefinition, index) in serverCanvases",
        :id="`canvas_${index}`",
        :key="index",
        :width="canvasDefinition.size.width",
        :height="canvasDefinition.size.height",
        :style="canvasDefinition.style"
      ) 
</template>

<style lang="sass" scoped>
.app
  height: 100vh
  min-height: 100vh
  width: 100vw
  min-width: 100vw
  display: flex
  overflow: hidden

  .left
    flex-grow: 1
    width: 50%
    display: flex
    flex-direction: column

  .right
    flex-grow: 1
    width: 50%
    border-left: solid 1px black
    display: flex
    flex-direction: column

.title
  padding: 0.5rem
  width: 100%
  background: gray
  font-weight: bold
  border-bottom: solid 1px black
</style>
