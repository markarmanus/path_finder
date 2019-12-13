
## Run Chicken

Run Chicken is a game where the player AI uses A* to find its shortest path to the chicken and catch it. While it may seem simple, The player has a health bar that is damaged by campfires and the Chicken has its own AI that uses UCS and BFS to utilize the campfires to its advantage. Healthpacks can be added to the map to help give the player a push.

### The website can be found here: https://markarmanus.github.io/runChicken/

## To Run locally:

1. Clone the Repo to your local device.

2. Run `npm install`

3. Run `npm start`

4. The website should be hosted at http://localhost:3000/

## How to Play.

-   The left navbar allows you to edit the map in real time while the game is running an the AI will adapt to changes.
-   The control panel at the bottom middle allows you to start and restart the game and control all things related to the environment.
-   The share map button generates a link that you can send to friend that loads the map you have created when clicking the button. 

Note: You can load pre made levels created by the developer to get an idea of how everything fits together.

## How it Works.

The application was created solely with React and CSS, to demonstrate the power of react rendering, All the AI code is in the AI file, and you are welcome to read the code. There is comments where ever needed to understand the code, other wise it should be easy to grasp from just reading the code.

