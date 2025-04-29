import { app, BrowserWindow } from 'electron';
import { createWindow } from './window';
// import { is } from '@electron-toolkit/utils';
import type { SyphonServerDescription } from 'node-syphon';
import { SyphonServerDirectory, SyphonServerDirectoryListenerChannel } from 'node-syphon';

const directory = new SyphonServerDirectory();
directory.listen();

app.whenReady().then(() => {
  createWindow('/');

  console.log('DIRECT');
  directory.on(
    SyphonServerDirectoryListenerChannel.SyphonServerAnnounceNotification,
    (server: SyphonServerDescription) => {
      console.log('ANNOUNCE', server);
    },
  );

  directory.on(
    SyphonServerDirectoryListenerChannel.SyphonServerRetireNotification,
    (server: SyphonServerDescription) => {
      console.log('RETIRE', server);
    },
  );

  directory.on(
    SyphonServerDirectoryListenerChannel.SyphonServerUpdateNotification,
    (server: SyphonServerDescription) => {
      console.log('UPDATE', server);
    },
  );

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow('/');
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  directory.dispose();
});
