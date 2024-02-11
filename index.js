const floorInput = document.querySelector("#num-of-floors");
const liftInput = document.querySelector("#num-of-lifts");
const sectionForm = document.querySelector(".form");
const sectionLiftFloor = document.querySelector("#lift-sim-section");
const simBtn = document.querySelector("#simulate");
const lifts = document.querySelector(".lifts");
const floors = document.querySelector(".floors");

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
  //   simulateLifts(numOfLifts)
};

simBtn.addEventListener("click", simulate);
function toggleDoors(lift) {
  lift.classList.toggle("open");
}
function openCloseDoor1() {
  const lift = document.querySelector(".lift");
  toggleDoors(lift);
  setTimeout(() => toggleDoors(lift), 2500);
}

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
    // if no lift on this floor, call the nearest  free lift,
    if (this.lifts.length) {
      this.lifts[0].engage();
    } else {
    }
    // else open the first free lift here
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
    // open and close door wherever the lift is if
    // it is not travelling
    if (!this.travelling) {
      openCloseDoor(this.element);
    }
  }

  goToFloor(floorNumber) {}
}

// when user clicks simulate
// generate the required floors, and put in
// the required num of lifts at the ground floor 0

function simulateFloors(num) {
  let floorNumber = num - 1;
  const floors = [];
  while (floorNumber >= 0) {
    const hasUp = floorNumber !== num - 1;
    const hasDown = floorNumber !== 0;
    let element = createFloorElement(floorNumber, hasUp, hasDown);
    sectionLiftFloor.appendChild(element);
    floors.push(new Floor(floorNumber, [], element));
    floorNumber--;
  }
}

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
function simulateLifts(num) {}
