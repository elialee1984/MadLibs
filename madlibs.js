let adjective, noun, verb, name

const madLibsStory = `Once upon a time, there was a {{adjective}} {{noun}} who loved to {{verb}} all day long. One day, {{name}}, the {{adjective}} friend, joined {{noun}} on a {{adjective}} adventure to find the {{noun}}.`;

import * as readline from 'readline';
import { readFile } from 'fs/promises';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function replacePlaceholders(story, replacements) {
  let result = story;
  Object.keys(replacements).forEach(placeholder => {
    const regex = new RegExp(`{{${placeholder}}}`, 'g');
    result = result.replace(regex, replacements[placeholder]);
  });
  return result;
}

async function startGame() {
  try {
    const data = await readFile('story.txt', 'utf8');

    const placeholders = data.match(/{{(.*?)}}/g).map(match => match.slice(2, -2));
    const replacements = {};

    const askPlaceholder = index => {
      if (index >= placeholders.length) {
        const finalStory = replacePlaceholders(data, replacements);
        console.log('\nYour MadLibs story:\n', finalStory);
        rl.close();
      } else {
        const placeholder = placeholders[index];
        rl.question(`Enter a ${placeholder}: `, answer => {
          replacements[placeholder] = answer;
          askPlaceholder(index + 1);
        });
      }
    };

    askPlaceholder(0);
  } catch (err) {
    console.error('Error reading the story template:', err);
    rl.close();
  }
}

startGame();
