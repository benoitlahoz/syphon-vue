import { join } from 'node:path';
import type { WebContentsPaintEventParams } from 'electron';
import { BrowserWindow, shell } from 'electron';
import { is } from '@electron-toolkit/utils';

export const createWindow = (route: string, width = 900, height = 600) => {
  const win = new BrowserWindow({
    width,
    height,
    minWidth: width,
    minHeight: height,
    show: false,
    webPreferences: {
      contextIsolation: true, // Doesn't work with `false` either.
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: false,
      // For canvas.
      nodeIntegrationInWorker: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url, frameName, features }) => {
    if (frameName.startsWith('syphon_')) {
      console.log(url, features);

      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          // parent: win,
          show: false,
          webPreferences: {
            offscreen: {
              useSharedTexture: true,
            },
            nodeIntegrationInWorker: true,
            preload: join(__dirname, '../preload/index.js'),
          },
        },
        /*
        createWindow(options) {
          const newOptions = {
            ...options,
            // parent: win,
            show: false,
            frame: false,
            titleBarStyle: 'hidden' as const,
            webPreferences: {
              ...options.webPreferences,
              offscreen: {
                useSharedTexture: true,
              },
              nodeIntegration: false,
              nodeIntegrationInWorker: true,
              preload: join(__dirname, '../preload/index.js'),
            },
          };

          const browserWindow = new BrowserWindow(newOptions);

          const handlePaint = (event: WebContentsPaintEventParams) => {
            const texture = event.texture;
            console.log('IN');
            if (texture) {
              const handle = texture.textureInfo.sharedTextureHandle;

              // Here: node-syphon publishes handle.

              texture.release();
            }
          };

          browserWindow.webContents.on('paint', handlePaint);

          browserWindow.on('close', () => {
            // Specific to node-syphon.
            // server.dispose();
          });

          return browserWindow.webContents;
        },
        */
      };
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Only emitted when not using 'createWindow'
  win.webContents.on('did-create-window', (subwindow, details) => {
    console.log('Did create window', details);

    const handlePaint = (event: WebContentsPaintEventParams) => {
      const texture = event.texture;
      console.log('IN');
      if (texture) {
        const handle = texture.textureInfo.sharedTextureHandle;

        // Here: node-syphon publishes handle.

        texture.release();
      }
    };
    subwindow.webContents.on('paint', handlePaint);
  });

  win.webContents.on('render-process-gone', (_event: any, details: any) => {
    console.log('Renderer process is gone with details:', details);
  });

  win.on('ready-to-show', () => {
    win.show();
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}`);
  } else {
    win.loadFile(`${join(__dirname, '../renderer/index.html')}`, { hash: route.replace('/', '') });
  }

  return win;
};
