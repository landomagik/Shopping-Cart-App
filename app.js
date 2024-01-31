import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-f32ba-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const addButton = document.querySelector("#add-button");
const inputField = document.querySelector("#input-field");
const shoppingList = document.querySelector("#shopping-list");

addButton.addEventListener('click', inputItem)

inputField.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        inputItem();
    }
});

function inputItem() {
    let inputValue = inputField.value

    if (inputValue == "") {
        alert("You must enter something!")

    } else {

        push(shoppingListInDB, inputValue)

        clearInput();
    }
}

onValue(shoppingListInDB, function (snapshot) {

    if (snapshot.exists()) {

        let itemsArray = Object.entries(snapshot.val())
        clearShoppingList()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemId = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItem(currentItem)
        }
    } else {
        shoppingList.innerHTML = "No items here yet..."
    }
})

function clearShoppingList() {
    shoppingList.innerHTML = ""
}

function clearInput() {
    inputField.value = ""
}

function appendItem(item) {

    let itemId = item[0]
    let itemValue = item[1]

    let newListItem = document.createElement("li")

    newListItem.textContent = itemValue

    newListItem.addEventListener("dblclick", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`)

        remove(exactLocationOfItemInDB)
    })

    shoppingList.append(newListItem)

}
