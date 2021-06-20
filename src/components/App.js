import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { uuid } from "uuidv4";
import api from "../api/contacts";
import "./App.css";
import Header from "./header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import EditContact from "./EditContact";
import ContactDetail from "./ContactDetail";

function App() {
  //const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [searchResults, setsearchResults] = useState([]);

  //reterive contacts
  const reteriveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  };

  const addContactHandler = async (contact) => {
    console.log("addContactHandler()", contact);
    const request = {
      id: uuid(),
      ...contact,
    };

    const response = await api.post("/contacts", request);
    setContacts([...contacts, response.data]);
  };

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    console.log("updateContactHandler()", response);
    const { id, name, email } = response.data;

    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? { ...response.data } : contact;
      })
    );
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      //console.log("removeContactHandler()", contact);
      return contact.id !== id;
    });

    setContacts(newContactList);
  };

  const searchHandler = (searchTerm) => {
    //console.log("[App => searchHandler]", searchTerm);
    setsearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newContactList = contacts.filter((contact) => {
        return Object.values(contact)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        //console.log("[App => searchHandler]", Object.values(contact).join(" "));
      });
      setsearchResults(newContactList);
    } else {
      setsearchResults(contacts);
    }
  };

  useEffect(() => {
    // const reteriveContacts = JSON.parse(
    //   localStorage.getItem(LOCAL_STORAGE_KEY)
    // );
    // if (reteriveContacts) setContacts(reteriveContacts);

    const getAllContacts = async () => {
      const allContacts = await reteriveContacts();
      if (allContacts) setContacts(allContacts);
    };

    getAllContacts();
  }, []);

  useEffect(() => {
    //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  return (
    <div className="ui container">
      <Router>
        <Header />
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => (
              <ContactList
                {...props}
                contacts={searchTerm.length < 1 ? contacts : searchResults}
                getContactId={removeContactHandler}
                term={searchTerm}
                searchKeyword={searchHandler}
              />
            )}
          />
          <Route
            path="/add"
            render={(props) => (
              <AddContact {...props} addContactHandler={addContactHandler} />
            )}
          />
          <Route
            path="/edit"
            render={(props) => (
              <EditContact
                {...props}
                updateContactHandler={updateContactHandler}
              />
            )}
          />
          <Route path="/contact/:id" component={ContactDetail} />
        </Switch>
        {/* <AddContact addContactHandler={addContactHandler} />
        <ContactList contacts={contacts} getContactId={removeContactHandler} /> */}
      </Router>
    </div>
  );
}

export default App;
