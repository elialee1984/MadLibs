let adjective, noun, verb, name

const madLibsStory = `Once upon a time, there was a {{adjective}} {{noun}} who loved to {{verb}} all day long. One day, {{name}}, the {{adjective}} friend, joined {{noun}} on a {{adjective}} adventure to find the {{noun}}.`;


// import * as readline from 'node:readline/promises';
// import { stdin as input, stdout as output } from 'node:process';

// const rl = readline.createInterface({ input, output });
// async function fillMadLibs() {
//     const wordRegex = /\[[a-zA-Z]+\]/g;
//     const placeholders = madLibsStory.match(wordRegex);
  
//     if (!placeholders) {
//       console.log('No placeholders found in the story.');
//       return;
//     }
  
//     const words = {};
  
//     for (const placeholder of placeholders) {
//       const wordType = placeholder.slice(1, -1); // Removing the brackets []
//       const question = `Enter a ${wordType}: `;
//       words[wordType] = await rl.question(question);
//     }
  
//     return madLibsStory.replace(wordRegex, match => words[match.slice(1, -1)]);
//   }
//   async function main() {
//     const completedStory = await fillMadLibs();
//     console.log('\nYour MadLibs Story:\n');
//     console.log(completedStory);
//     rl.close();
//   }
  
//   main().catch(err => console.error('Error:', err));
  
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
