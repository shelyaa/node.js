//task1
async function runSequent<T, R>(array: T[], callback: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const result = await callback(item, i);
    results.push(result);
  }

  return results;
}

// Example usage:
const array: string[] = ["one", "two", "three"];
const results = await runSequent(array, (item, index) =>
  Promise.resolve({
    item,
    index,
  })
);


//task 2
function arrayChangeDelete<T>(array: T[], rule: (item: T) => boolean): T[] {
  const deletedElements: T[] = [];

  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i];

    if (rule(item)) {
      deletedElements.unshift(...array.splice(i, 1));
    }
  }

  return deletedElements;
}

// Приклад використання:
const array: number[] = [1, 2, 3, 6, 7, 9];
const deletedElements = arrayChangeDelete(array, (item) => item % 2 === 0);

console.log("array =", array);
console.log("deletedElements =", deletedElements);

//task3

import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosResponse, AxiosError } from 'axios';

const jsonFilePath: string = process.argv[2];

const jsonData: string = fs.readFileSync(jsonFilePath, 'utf8');
const links: string[] = JSON.parse(jsonData);

const folderName: string = `${path.basename(jsonFilePath, '.json')}_pages`;
fs.mkdirSync(folderName);

async function fetchAndWriteData(link: string): Promise<void> {
  try {
    const response: AxiosResponse = await axios.get(link);
    const htmlContent: string = response.data;
    const fileName: string = `${folderName}/${path.basename(link)}.html`;
    fs.writeFileSync(fileName, htmlContent);
  } catch (error: AxiosError) {
    console.error(error.message);
  }
}

links.forEach((link: string) => fetchAndWriteData(link));


//task 4
import os from 'os';
import si from 'systeminformation';

function formatBytes(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}

async function logSystemInfo(frequency: number): Promise<void> {
  while (true) {
    const systemInfo = await Promise.all([
      si.osInfo(),
      si.cpu(),
      si.graphics(),
      si.mem(),
      si.battery(),
    ]);

    const [
      osInfo,
      cpuInfo,
      graphicsInfo,
      memInfo,
      batteryInfo,
    ] = systemInfo;

    console.log('Operating System:', osInfo.distro);
    console.log('Architecture:', os.arch());
    console.log('Current User Name:', os.userInfo().username);
    console.log('CPU Cores Models:', cpuInfo.cores.map((core) => core.model));
    console.log('CPU Temperature:', cpuInfo.main.temp, '°C');
    console.log(
      'Graphic Controllers:',
      graphicsInfo.controllers.map(
        (controller) => `${controller.vendor} - ${controller.model}`
      )
    );
    console.log(
      'Memory:',
      `Total: ${formatBytes(memInfo.total)}`,
      `Used: ${formatBytes(memInfo.used)}`,
      `Free: ${formatBytes(memInfo.free)}`
    );
    console.log(
      'Battery:',
      `Charging: ${batteryInfo.ischarging ? 'Yes' : 'No'}`,
      `Percent: ${batteryInfo.percent}%`,
      `Remaining Time: ${formatSeconds(batteryInfo.timeremaining)}`
    );

    await new Promise((resolve) => setTimeout(resolve, frequency * 1000));
  }
}

const frequencyInSeconds: number = parseInt(process.argv[2]);

if (isNaN(frequencyInSeconds)) {
  console.log('Please provide a valid frequency in seconds as a command line argument.');
} else {
  logSystemInfo(frequencyInSeconds).catch((error) => {
    console.error('An error occurred:', error);
  });
}

//task5
type EventHandler<T> = (payload: T) => void;

class MyEventEmitter<T> {
  private handlers: { [event: string]: EventHandler<T>[] } = {};

  public registerHandler(event: string, handler: EventHandler<T>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  public emitEvent(event: string, payload: T): void {
    const eventHandlers = this.handlers[event];
    if (eventHandlers) {
      eventHandlers.forEach((handler) => handler(payload));
    }
  }
}

// Example usage:
const emitter = new MyEventEmitter();
emitter.registerHandler('userUpdated', () => console.log('User account updated'));
emitter.emitEvent('userUpdated');


