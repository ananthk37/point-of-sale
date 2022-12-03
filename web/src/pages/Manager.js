import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../API";
import IngredientTable from "../components/IngredientTable";
import MenuItemsTable from "../components/MenuItemsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import Multiselect from "multiselect-react-dropdown";
import "./Manager.css";

function Manager() {
  const [ingredientData, setIngredientData] = useState([]);
  const [menuItemData, setMenuItemData] = useState([]);
  const [multiselectOptions, setMultiselectOptions] = useState([]);

  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [showEditIngredientModal, setShowEditIngredientModal] = useState(false);
  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState(false);
  const [showEditMenuItemModal, setShowEditMenuItemModal] = useState(false);

  const [restockAmount, setRestockAmount] = useState("");
  const [fillLevel, setFillLevel] = useState("");
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientType, setNewIngredientType] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemIngredients, setNewItemIngredients] = useState([]);

  const [addEmployeeName, setNewEmployeeName] = useState("");
  const [addEmployeePassword, setNewEmployeePassword] = useState("");
  const [addAsManager, setAsManager] = useState([false, false]);
  const [addedEmployeeDatabase, setAddedEmployeeDatabase] = useState(null);
  const [condrender, setcondrender] = useState(localStorage.getItem("manager"));

  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  const protectedIngredients = [
    "House Blend",
    "Mozzarella",
    "Parmesan",
    "Ricotta",
    "Vegan",
    "Dough",
    "Balsamic Glaze",
    "Basil Pesto",
    "BBQ Sauce",
    "Olive Oil",
    "Oregano",
    "Sriracha",
    "Applewood Bacon",
    "Black Forest Ham",
    "Italian Sausage",
    "Meatball",
    "Pepperoni",
    "Salami",
    "Smoked Chicken",
    "Boxes",
    "Cups",
    "Napkins",
    "Black Olives",
    "Cherry Tomato",
    "Green Peppers",
    "Jalapenos",
    "Kalmata Olives",
    "Red Onions",
    "Red Peppers",
    "Spinach",
    "Broccolini",
    "Caramelized Onions",
    "Garlic",
    "Mixed Mushrooms",
    "Red Potatoes",
    "Pesto",
    "Red",
    "White",
    "Zesty Red",
  ];

  const client = axios.create({
    baseURL: API_URL,
  });

  useEffect(() => {
    loadIngredients();
    loadMenuItems();
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    loadIngredients();
    loadMenuItems();
    setTimeout(() => {
      setLoading(false);
    }, 500);
    loadIngredients();
    loadMenuItems();
    setTimeout(() => {
      setLoading(false);
    }, 500);
    loadIngredients();
    loadMenuItems();
  }, [selectedIngredient, selectedMenuItem, newItemName, newIngredientName]);

  async function loadIngredients() {
    await client.get("/api/manager/load_ingredients").then((res) => {
      var ingredients = [];
      var options = [];
      for (var i = 0; i < res.data.length; i++) {
        ingredients.push({
          name: res.data[i][0],
          type: res.data[i][1],
          inventory: res.data[i][2],
          fill_level: 10,
        });
      }
      ingredients.sort((a, b) => {
        const typeA = a.type.toUpperCase();
        const typeB = b.type.toUpperCase();
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (typeA < typeB) return -1;
        if (typeA > typeB) return 1;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      ingredients.forEach((element, index) => options.push({name:element.name, id:index}))
      setIngredientData(ingredients);
      setMultiselectOptions(options);
    });
  }

  async function loadMenuItems() {
    await client.get("/api/manager/load_prices").then((res) => {
      const items = [];
      for (var i = 0; i < res.data["pizza_types"].length; i++) {
        items.push({
          name: res.data["pizza_types"][i]["pizza_type"],
          price: res.data["pizza_types"][i]["pizza_price"],
          type: "Pizza Type",
        });
      }
      for (i = 0; i < res.data["drink_types"].length; i++) {
        items.push({
          name: res.data["drink_types"][i]["drink_type"],
          price: res.data["drink_types"][i]["drink_price"],
          type: "Drink Type",
        });
      }
      for (i = 0; i < res.data["seasonal_items"].length; i++) {
        items.push({
          name: res.data["seasonal_items"][i]["item_name"],
          price: res.data["seasonal_items"][i]["item_price"],
          type: "Seasonal Item",
        });
      }
      items.sort((a, b) => {
        const typeA = a.type.toUpperCase();
        const typeB = b.type.toUpperCase();
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (typeA < typeB) return -1;
        if (typeA > typeB) return 1;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      setMenuItemData(items);
    });
  }

  function handleRestockChange(event) {
    setRestockAmount(event.target.value);
  }

  function handleFillLevelChange(event) {
    setFillLevel(event.target.value);
  }

  function handleAddNameChange(event) {
    setNewIngredientName(event.target.value);
  }

  function handleAddTypeChange(event) {
    setNewIngredientType(event.target.value);
  }

  function handleNewItemNameChange(event) {
    setNewItemName(event.target.value);
  }

  function handleNewItemPriceChange(event) {
    setNewItemPrice(event.target.value);
  }

  function handleAddEmployeeName(event) {
    setNewEmployeeName(event.target.value);
  }

  function handleAddEmployeePassword(event) {
    setNewEmployeePassword(event.target.value);
  }

  function handleAddAsManager(event) {
    setAsManager(event);
    console.log(event);
  }

  async function handleAddNewEmployee() {
    if (addEmployeeName.length === 0) {
      console.error("Invalid Input for Employee Name: No name is given.");
    } else if (isNaN(addEmployeePassword)) {
      console.error("Invalid Input for Employee Password: Password is NaN.");
    } else {
      await client
        .post("/api/manager/addEmployee", {
          emp: addEmployeeName,
          pass: addEmployeePassword,
          status: addAsManager.length > 2 ? "true" : "false",
        })
        .then((res) => {
          if (res.data === true) {
            setAddedEmployeeDatabase(true);
          } else {
            setAddedEmployeeDatabase(false);
          }
        });
      setAsManager([false, false]);
      setNewEmployeeName("");
      setNewEmployeePassword("");
    }
  }

  function handleEditIngredientClick(ingredient_name) {
    setSelectedIngredient(ingredient_name);
    setShowEditIngredientModal(true);
  }

  function handleDeleteIngredientClick(ingredient_name) {
    client.post("/api/manager/remove_ingredient", {
      ingredients: [ingredient_name],
    });
    loadIngredients();
    setTimeout(() => {
      setLoading(false);
    }, 500);
    loadIngredients();
  }

  function handleAddIngredientClick() {
    setShowAddIngredientModal(true);
  }

  function handleEditMenuItemClick(item_name) {
    setSelectedMenuItem(item_name);
    setShowEditMenuItemModal(true);
  }

  function handleDeleteMenuItemClick(item_name) {
    console.log("Del " + item_name);
  }

  function handleAddMenuItemClick() {
    setShowAddMenuItemModal(true);
  }

  function handleAddNewItemIngredient(selectedList, selectedItem) {
    setNewItemIngredients(newItemIngredients.concat(selectedItem));
  }

  function handleRemoveNewItemIngredient(selectedList, removedItem) {
    setNewItemIngredients(selectedList);
  }

  function addIngredient() {
    if (newIngredientName === "") {
      console.error(
        "Invalid Input for Add Ingredient: Ingredient name is null."
      );
    } else if (newIngredientType === "") {
      console.error(
        "Invalid Input for Add Ingredient: Ingredient type is null."
      );
    } else {
      client.post("/api/manager/add_ingredient", {
        ingredient_name: newIngredientName,
        ingredient_type: newIngredientType,
      });
      loadIngredients();
      setNewIngredientName("");
      setNewIngredientType("");
    }
  }

  function editIngredient() {
    if (restockAmount !== "") {
      if (isNaN(restockAmount)) {
        console.error(
          "Invalid Input for Restock Ingredient: Restock amount is NaN."
        );
      } else {
        client.post("/api/manager/restock", {
          ingredients: [selectedIngredient],
          amount: restockAmount,
        });
        setRestockAmount("");
        loadIngredients();
      }
    }
  }

  function editMenuItem() {
    if (newItemPrice === "") {
      console.error(
        "Invalid Input for Update Menu Item Price: New item price is null."
      );
    } else if (isNaN(newItemPrice)) {
      console.error(
        "Invalid Input for Update Menu Item Price: New item price is NaN."
      );
    } else {
      client.post("/api/manager/update_menu_items", {
        menu_items: [selectedMenuItem],
        new_price: newItemPrice,
      });
      loadMenuItems();
      setNewItemPrice("");
    }
  }

  async function addMenuItem() {
    if (newItemName === "") {
      console.error(
        "Invalid Input for Add Seasonal Item: Seasonal item name is null."
      );
    } else if (newItemPrice === "") {
      console.error(
        "Invalid Input for Add Seasonal Item: Seasonal item price is null."
      );
    } else if (isNaN(newItemPrice)) {
      console.error(
        "Invalid Input for Add Seasonal Item: Seasonal item price is NaN."
      );
    } else {
      console.log(newItemName);
      console.log(newItemPrice);
      var new_ingredients = [];
      newItemIngredients.forEach((element) =>
        new_ingredients.push(element.name)
      );
      await client.post("/api/manager/add_seasonal_item", {
        item_name: newItemName,
        ingredients: new_ingredients,
        price: newItemPrice,
      });
      loadMenuItems();
      setNewItemName("");
      setNewItemPrice("");
    }
  }

  function hideModal() {
    setShowAddIngredientModal(false);
    setShowEditIngredientModal(false);
    setShowAddMenuItemModal(false);
    setShowEditMenuItemModal(false);

    setRestockAmount("");
    setFillLevel("");
    setNewIngredientName("");
    setNewIngredientType("");
    setSelectedIngredient("");

    setNewItemName("");
    setNewItemPrice("");
    setNewItemIngredients([]);
    setSelectedMenuItem("");
  }

  function submitModal() {
    if (showAddIngredientModal) {
      addIngredient();
    } else if (showEditIngredientModal) {
      editIngredient();
    } else if (showAddMenuItemModal) {
      addMenuItem();
    } else if (showEditMenuItemModal) {
      editMenuItem();
    }
    hideModal();
  }

  if (condrender === "true") {
    if (loadingItems || loading) {
      return (
        <div
          style={{
            width: "100vw",
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <img
            src={require("../loader_pizza.gif")}
            alt="Loading"
            style={{ width: "15vw", height: "auto" }}
          />
        </div>
      );
    } else {
      return (
        <span className="translate">
          <div className="row w-100">
            <div
              className="modal fade"
              id="inputModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      {showAddIngredientModal && <p>Add New Ingredient</p>}
                      {showEditIngredientModal && (
                        <p>Edit Ingredient {selectedIngredient}</p>
                      )}
                      {showAddMenuItemModal && <p>Add New Seasonal Item</p>}
                      {showEditMenuItemModal && (
                        <p>Edit Menu Item {selectedMenuItem}</p>
                      )}
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={hideModal}></button>
                  </div>
                  <div className="modal-body">
                    {showEditIngredientModal && (
                      <div>
                        <div className="d-flex justify-content-center">
                          <p className="mx-auto">Leave blank if no change</p>
                        </div>
                        <div className="row d-flex align-items-center my-2">
                          <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <h6 className="my-auto mx-2">Restock Inventory</h6>
                          </div>
                          <div className="col-7">
                            <input
                              type="text"
                              placeholder="Restock Amount"
                              className="mx-2 w-75"
                              style={{ height: "36px" }}
                              value={restockAmount}
                              onChange={handleRestockChange}></input>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center my-2">
                          <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <h6 className="my-auto mx-2">Change Fill Level</h6>
                          </div>
                          <div className="col-7">
                            <input
                              type="text"
                              placeholder="Fill Level"
                              className="mx-2 w-75"
                              style={{ height: "36px" }}
                              value={fillLevel}
                              onChange={handleFillLevelChange}></input>
                          </div>
                        </div>
                      </div>
                    )}
                    {showAddIngredientModal && (
                      <div>
                        <div className="row d-flex align-items-center my-2">
                          <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <h6 className="my-auto mx-2">Ingredient Name</h6>
                          </div>
                          <div className="col-7">
                            <input
                              type="text"
                              placeholder="Name"
                              className="mx-2 w-75"
                              style={{ height: "36px" }}
                              value={newIngredientName}
                              onChange={handleAddNameChange}></input>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center my-2">
                          <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <h6 className="my-auto mx-2">Ingredient Type</h6>
                          </div>
                          <div className="col-7">
                            <select
                              className="form-select w-75 mx-2"
                              onChange={handleAddTypeChange}
                              defaultValue="">
                              <option value="">
                                <span className="translate">Select Type</span>
                              </option>
                              <option value="Sauce">
                                <span className="translate">Sauce</span>
                              </option>
                              <option value="Cheese">
                                <span className="translate">Cheese</span>
                              </option>
                              <option value="Dough">
                                <span className="translate">Dough</span>
                              </option>
                              <option value="Drizzle">
                                <span className="translate">Drizzle</span>
                              </option>
                              <option value="Meats">
                                <span className="translate">Meats</span>
                              </option>
                              <option value="Raw Veggies">
                                <span className="translate">Raw Veggies</span>
                              </option>
                              <option value="Roasted Veggies">
                                <span className="translate">
                                  Roasted Veggies
                                </span>
                              </option>
                              <option value="Other">
                                <span className="translate">Other</span>
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center my-2">
                          <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <h6 className="my-auto mx-2">Fill Level</h6>
                          </div>
                          <div className="col-7">
                            <input
                              type="text"
                              placeholder="Fill Level Percentage"
                              className="mx-2 w-75"
                              style={{ height: "36px" }}
                              value={fillLevel}
                              onChange={handleFillLevelChange}></input>
                          </div>
                        </div>
                      </div>
                    )}
                    {showAddMenuItemModal && (
                      <div>
                        <div className="row d-flex align-items-center my-2">
                          <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <h6 className="my-auto mx-2">Item Name</h6>
                          </div>
                          <div className="col-7">
                            <input
                              type="text"
                              placeholder="Name"
                              className="mx-2 w-75"
                              style={{ height: "36px" }}
                              value={newItemName}
                              onChange={handleNewItemNameChange}></input>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center my-2">
                          <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <h6 className="my-auto mx-2">Item Price</h6>
                          </div>
                          <div className="col-7">
                            <input
                              type="text"
                              placeholder="Price"
                              className="mx-2 w-75"
                              style={{ height: "36px" }}
                              value={newItemPrice}
                              onChange={handleNewItemPriceChange}></input>
                          </div>
                        </div>
                        <div className="row d-flex align-items-center my-2">
                          <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <h6 className="my-auto mx-2">Item Ingredients</h6>
                          </div>
                          <div className="multiselect col-7">
                            <div className="mx-2 w-75">
                              <Multiselect
                                options={multiselectOptions}
                                selectedValues={newItemIngredients}
                                onSelect={handleAddNewItemIngredient}
                                onRemove={handleRemoveNewItemIngredient}
                                displayValue="name"
                                avoidHighlightFirstOption={true}
                                style={{ chips: { background: "#e8b74d" } }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {showEditMenuItemModal && (
                      <div>
                        <div className="row d-flex align-items-center my-2">
                          <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <h6 className="my-auto mx-2">Change Item Price</h6>
                          </div>
                          <div className="col-7">
                            <input
                              type="text"
                              placeholder="New Item Price"
                              className="mx-2"
                              style={{ height: "36px" }}
                              value={newItemPrice}
                              onChange={handleNewItemPriceChange}></input>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={hideModal}>
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={submitModal}>
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col my-5">
              <IngredientTable
                ingredientData={ingredientData}
                handleEditIngredientClick={handleEditIngredientClick}
                handleDeleteIngredientClick={handleDeleteIngredientClick}
                handleAddIngredientClick={handleAddIngredientClick}
                protectedIngredients={protectedIngredients}></IngredientTable>
            </div>
            <div className="col my-auto">
              {/* <MenuItemsTable menuItemData={menuItemData}></MenuItemsTable> */}
              <div className="container">
                <div
                  className="border border-dark mx-5"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <table className="w-100">
                    <thead className="table-header position-sticky">
                      <tr>
                        <th className="px-1">Menu Item</th>
                        <th className="px-1">Type</th>
                        <th className="px-1">Price</th>
                        <th className="px-1">Edit</th>
                        <th className="px-1">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItemData.map((item, key) => {
                        return (
                          <tr
                            key={key}
                            className="table-row border-top border-secondary">
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>{item.price}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm mx-auto"
                                data-bs-toggle="modal"
                                data-bs-target="#inputModal"
                                onClick={() =>
                                  handleEditMenuItemClick(item.name)
                                }>
                                <FontAwesomeIcon icon={faPencil} />
                              </button>
                            </td>
                            <td>
                              {item.type === "Seasonal Item" && (
                                <button
                                  className="btn btn-primary btn-sm mx-auto"
                                  onClick={() =>
                                    handleDeleteMenuItemClick(item.name)
                                  }>
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end mx-5">
                  <button
                    className="btn btn-primary btn-sm mt-3"
                    data-bs-toggle="modal"
                    data-bs-target="#inputModal"
                    onClick={handleAddMenuItemClick}>
                    Add Menu Item
                  </button>
                </div>
              </div>
              {/* <div className="mx-5 mt-5">
                <table className="w-75 border border-dark mx-auto">
                  <thead className="table-header position-sticky">
                    <tr>
                      <th className="px-1">Menu Item</th>
                      <th className="px-1">Price</th>
                      <th className="px-1">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItemData.map((item, key) => {
                      return (
                        <tr key={key} className="border-top border-secondary">
                          <td>{item.name}</td>
                          <td>{item.price}</td>
                          <td></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div> */}

              {/* <div
                className="border border-secondary rounded p-3 mt-3 mb-5 mx-auto"
                style={{ width: "80%" }}>
                <h4 className="text-center">
                  <span className="translate">Add Employee to System</span>
                </h4>
                <div className="d-flex justify-content-center flex-wrap">
                  <span className="translate">
                    <input
                      type="text"
                      placeholder="Employee Name"
                      className="m-2"
                      value={addEmployeeName}
                      style={{ height: "36px" }}
                      onChange={handleAddEmployeeName}></input>
                  </span>
                  <span className="translate">
                    <input
                      type="text"
                      placeholder="Employee Passcode"
                      className="m-2"
                      value={addEmployeePassword}
                      style={{ height: "36px" }}
                      onChange={handleAddEmployeePassword}></input>
                  </span>
                  <div className="">
                    <div className="form-check form-check-lg m-2 align-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="Add Manager"
                        onChange={handleAddAsManager}
                        id="managerCheck"></input>
                      <label className="form-check-label">
                        <span className="translate">Add as Manager?</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center flex-wrap">
                  <span className="translate">
                    <input
                      type="button"
                      className="btn btn-primary my-2"
                      value="Add Employee"
                      onClick={handleAddNewEmployee}></input>
                  </span>
                </div>
                {addedEmployeeDatabase === true && (
                  <div
                    className="d-flex justify-content-center flex-wrap"
                    style={{ color: "blue" }}>
                    <span className="translate">Added New Employee.</span>
                  </div>
                )}
                {addedEmployeeDatabase === false && (
                  <div
                    className="d-flex justify-content-center flex-wrap"
                    style={{ color: "red" }}>
                    <span className="translate">
                      Failed to Add New Employee. Try Different Passcode.
                    </span>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </span>
      );
    }
  }
}

export default Manager;
