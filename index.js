const floorInput = document.querySelector("#num-of-floors");
const liftInput = document.querySelector("#num-of-lifts");
const sectionForm = document.querySelector(".form");
const sectionLiftFloor = document.querySelector("#lift-sim-section");
const simBtn = document.querySelector("#simulate");

const simulate = () => {
  // get the inputs and create nodes and append to document
  const numOfFloors = floorInput.value;
  const numOfLifts = liftInput.value;
  //   const liftNode = document.createElement("span");
  //   const floorNode = document.createElement("span");
  //   liftNode.append(numOfLifts);
  //   floorNode.append(numOfFloors);
  //   lifts.appendChild(liftNode);
  //   floors.appendChild(floorNode);
  // clean the input fields and show the output
  floorInput.value = "";
  liftInput.value = "";
  sectionForm.classList.add("hidden");
  sectionLiftFloor.classList.toggle("hidden");
  simulateFloors(numOfFloors);
  simulateLifts(numOfLifts);
};

simBtn.addEventListener("click", simulate);
function toggleDoors(lift) {
  lift.classList.toggle("open");
}
// function openCloseDoor1() {
//   const lift = document.querySelector(".lift");
//   toggleDoors(lift);
//   setTimeout(() => toggleDoors(lift), 2500);
// }

function openCloseDoor(lift) {
  toggleDoors(lift);
  setTimeout(() => toggleDoors(lift), 2500);
}

class Floor {
  constructor(number, lifts, element) {
    this.number = number;
    this.lifts = lifts;
    this.element = element;
  }

  callLift() {
    // Find the nearest idle lift
    const nearestLift = findNearestIdleLift(this.number);
    if (nearestLift) {
      nearestLift.goToFloor(this.number);
    }
  }
}

class Lift {
  constructor(number, atFloor, element) {
    this.number = number;
    this.isOpen = false;
    this.travelling = false;
    this.atFloor = atFloor;
    this.element = element;
  }

  engage() {
    // Simulate opening and closing doors
    openCloseDoor(this.element);
  }

  goToFloor(floorNumber) {
    console.log(
      `Lift ${this.number} is moving to floor ${floorNumber} from floor ${this.atFloor}`
    );
    console.log(floors, lifts);
    this.travelling = true;
    // remove lift from current floor
    const currentFloor = floors.find((floor) => floor.number === this.atFloor);
    currentFloor.lifts = currentFloor.lifts.filter(
      (lift) => lift.number !== this.number
    );
    simulateTravelAnimation(this, floorNumber);
    const currentFloorIndex = floors.length - 1 - this.atFloor;
    const targetFloorIndex = floors.length - 1 - floorNumber;
    const numberOfFloorsToTravel = Math.abs(
      targetFloorIndex - currentFloorIndex
    );
    const travelTime = numberOfFloorsToTravel * 2000; // 2 seconds per floor
    // time to travel @2sec per floor = abs(finalFloor - currentFloor) * 2
    setTimeout(() => {
      // stop the lift after the specified duration and toggle doors
      setTimeout(() => this.engage(), 40);
      setTimeout(() => {
        this.travelling = false;
      }, 5000);
      // add lift to the new floor
      const floorToReach = floors.find((floor) => floor.number === floorNumber);
      floorToReach.lifts.push(this);
      console.log(floors, lifts);
    }, travelTime);
    this.atFloor = floorNumber;
  }
}

// when user clicks simulate
// generate the required floors, and put in
// the required num of lifts at the ground floor 0

function simulateTravelAnimation(lift, floorNumber) {
  const floorHeight = 160;
  const gapBetweenFloors = 8;
  const currentFloorIndex = floors.length - 1 - lift.atFloor;
  const targetFloorIndex = floors.length - 1 - floorNumber;
  const numberOfFloorsToTravel = Math.abs(targetFloorIndex - currentFloorIndex);

  // Calculate total distance considering height and gap between floors
  const totalDistance =
    numberOfFloorsToTravel * (floorHeight + gapBetweenFloors);
  const direction = targetFloorIndex > currentFloorIndex ? 1 : -1; // -1 for up, 1 for down

  // Calculate total travel time
  const travelTime = numberOfFloorsToTravel * 2; // 2 seconds per floor

  // Adjust CSS transition duration based on travel time
  lift.element.style.transition = `transform ${travelTime}s linear`;

  // Apply CSS transformation to simulate lift moving
  lift.element.style.transform = `translateY(${direction * totalDistance}px)`;

  // After the animation completes, physically move the lift in the DOM
  setTimeout(() => {
    lift.element.style.transform = "";
    lift.element.style.transition = "";

    // Physically move the lift element in the DOM to its new floor
    const startingFloorElement = floors[currentFloorIndex].element;
    const destinationFloorElement = floors[targetFloorIndex].element;
    startingFloorElement.removeChild(lift.element); // Remove from current floor
    destinationFloorElement.appendChild(lift.element); // Add to destination floor
  }, travelTime * 1000); // Convert seconds to milliseconds
}

// Global state of the application
let floors = [];
let lifts = [];

function createFloorElement(number, hasUp, hasDown) {
  let element;
  element = document.createElement("div");
  element.classList.add("floor");
  element.setAttribute("id", `floor-${number}`);
  //create buttons
  const btnElement = document.createElement("div");
  btnElement.classList.add("btns");
  const upBtn = document.createElement("button");
  upBtn.innerText = "Up";
  upBtn.classList.add("btn");
  upBtn.classList.add("green-btn");
  const downBtn = document.createElement("button");
  downBtn.classList.add("btn");
  downBtn.innerText = "Down";
  downBtn.classList.add("yellow-btn");
  if (hasUp) {
    btnElement.appendChild(upBtn);
  }
  if (hasDown) {
    btnElement.appendChild(downBtn);
  }

  //create floor line
  const floorLine = document.createElement("div");
  floorLine.classList.add("floor-line");
  //create floor num
  const floorNumElement = document.createElement("div");
  floorNumElement.classList.add("floor-num");
  floorNumElement.innerHTML = number;
  // add the created elements to floor element
  element.appendChild(btnElement);
  element.appendChild(floorLine);
  element.appendChild(floorNumElement);
  return element;
}

function simulateLifts(num) {
  let liftNumber = 0;
  while (liftNumber < num) {
    const floorNum = floors.length - 1; // by default all new lifts are at 0th
    let element = createLiftElement(liftNumber);
    const lift = new Lift(liftNumber, 0, element);
    lifts.push(lift);
    floors[floorNum].element.appendChild(lift.element);
    floors[floorNum].lifts.push(lift);
    liftNumber++;
  }
  console.log("initial state");
  console.log(floors, lifts);
}

function createLiftElement(liftNumber) {
  // Create a new div element
  const lift = document.createElement("div");

  // Add the 'lift' class to the element
  lift.classList.add("lift");

  // Add a variable class based on the liftNumber
  lift.setAttribute("id", `lift-${liftNumber}`);

  // Calculate the left position based on the liftNumber
  const leftPosition = 8 + 6 * liftNumber;

  // Set the style for the lift to position it
  lift.style.left = `${leftPosition}rem`;

  //Add doors to the lift
  const leftDoor = document.createElement("div");
  const rightDoor = document.createElement("div");
  leftDoor.classList.add("door");
  leftDoor.classList.add("left");
  rightDoor.classList.add("door");
  rightDoor.classList.add("right");
  lift.appendChild(leftDoor);
  lift.appendChild(rightDoor);

  return lift;
}

function simulateFloors(num) {
  let floorNumber = num - 1;
  while (floorNumber >= 0) {
    const hasUp = floorNumber !== num - 1;
    const hasDown = floorNumber !== 0;
    let element = createFloorElement(floorNumber, hasUp, hasDown);
    sectionLiftFloor.appendChild(element);

    const floor = new Floor(floorNumber, [], element);
    floors.push(floor);

    // Attach event listeners
    if (hasUp) {
      element
        .querySelector(".green-btn")
        .addEventListener("click", () => floor.callLift());
    }
    if (hasDown) {
      element
        .querySelector(".yellow-btn")
        .addEventListener("click", () => floor.callLift());
    }

    floorNumber--;
  }
}

function findNearestIdleLift(requestedFloor) {
  // Filter lifts that are not moving (travelling === false)
  const idleLifts = lifts.filter((lift) => !lift.travelling);
  console.log("number of idleLifts", idleLifts, idleLifts.lengths);
  // Find the nearest lift based on distance to the requested floor
  let nearestLift = null;
  let minDistance = Number.MAX_VALUE;

  idleLifts.forEach((lift) => {
    const distance = Math.abs(requestedFloor - lift.atFloor);
    if (distance < minDistance) {
      nearestLift = lift;
      minDistance = distance;
    }
  });

  return nearestLift;
}
