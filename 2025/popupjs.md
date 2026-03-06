# PopupJS Documentation

PopupJS is a lightweight JavaScript modal popup library designed for simple alerts, confirmations, and status messages without external dependencies.

---

## Features

* Lightweight and dependency‑free
* Simple API
* Alert / Success / Error popups
* Confirmation dialog with Promise support
* ESC key to close
* Prevents background scrolling
* Works in all modern browsers

---

## Installation

Include the PopupJS script in your page.

```html
<script src="popupjs.js"></script>
```

---

## Basic Usage

PopupJS provides a global object called `PopupJS`.

### Alert

```javascript
PopupJS.alert("Welcome back");
```

### Success Message

```javascript
PopupJS.success("User created successfully");
```

### Error Message

```javascript
PopupJS.error("Invalid email or password");
```

---

## Confirm Dialog

The confirm dialog returns a Promise.

```javascript
PopupJS.confirm("Delete this user?")
.then((ok)=>{

    if(ok){
        console.log("User deleted");
    }

});
```

### Async/Await Example

```javascript
async function deleteUser(){

    const ok = await PopupJS.confirm("Are you sure?");

    if(ok){
        console.log("Deleting user...");
    }

}
```

---

## Available Methods

| Method                     | Description              |
| -------------------------- | ------------------------ |
| `PopupJS.alert(message)`   | Show info popup          |
| `PopupJS.success(message)` | Show success popup       |
| `PopupJS.error(message)`   | Show error popup         |
| `PopupJS.confirm(message)` | Show confirmation dialog |

---

## Example Integration

```javascript
PopupJS.confirm("Delete this record?")
.then((ok)=>{

    if(ok){
        fetch("/delete-record");
    }

});
```

---

## Styling

PopupJS uses minimal built‑in styles. You can override them with CSS.

Example:

```css
.model-box{
    border-radius:8px;
}
```

---

## Browser Support

* Chrome
* Firefox
* Edge
* Safari

All modern browsers are supported.

---

## License

MIT License

---

## Author

Rajsoft Technologie
