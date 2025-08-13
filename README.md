# Description  

This project is the **frontend** of **SkyReserve**, offering user-friendly interfaces for managing flights.  
It supports two distinct user profiles:  

- **Admin** – manage flights, schedules, and system configurations.  
- **Passenger** – browse, book, and manage flight reservations.
  
🔗 **Backend Repository:** [SkyReserve Backend](https://github.com/SalaheddineBns/SkyReserve)  
---

# Run Project  

1. Ensure **Node.js v22** is installed on your machine.  
2. Run `npm install` to install all dependencies.  
3. Make sure the **SkyReserve backend** is running before starting the frontend.  

---

# Passenger Interface  

## Home Page  
- Displays the list of available flights filtered by date, departure city, and arrival city.  

<img width="1881" height="1011" alt="image" src="https://github.com/user-attachments/assets/e25387e0-be38-432d-a40d-6dead686895a" />

## Flight Page  
- Shows details of the selected flight and its price.  
- Contains passenger information forms, including:  
  - First Name  
  - Last Name  
  - Email  
  - Phone Number  
  - Baggage Information  
- Displays a summary of all passenger details before proceeding.  

<img width="1881" height="1011" alt="image" src="https://github.com/user-attachments/assets/69e06582-90bb-4436-b1d4-68ddd1bd4ee2" />  
<img width="1881" height="1011" alt="image" src="https://github.com/user-attachments/assets/5476afd6-0331-4445-b085-13077ddd89ab" />  
<img width="1881" height="1011" alt="image" src="https://github.com/user-attachments/assets/74b092b8-ad01-41fa-81d4-c5b46cb12480" />

## Payment Page  
- Displays reservation details.  
- Initiates the payment process.  

<img width="1881" height="1011" alt="image" src="https://github.com/user-attachments/assets/58313fa4-1c12-4112-9b03-19d76ccc2580" />

## Confirmation Page  
- Shows the PDF bill as proof of reservation.  
- Sends a confirmation email to the passenger.  

<img width="1881" height="1014" alt="image" src="https://github.com/user-attachments/assets/873d24de-ad15-4271-a10c-c524c3658ef5" />

## Check-in Page  
- Allows passengers to check in for a reservation by entering the booking ID.  
- Only available for flights departing in less than 48 hours.  
- Displays passenger details and a button to confirm check-in.  

<img width="1881" height="1014" alt="image" src="https://github.com/user-attachments/assets/754a2acf-2e5c-4c59-a715-c192fdcc84af" />  
<img width="1881" height="1014" alt="image" src="https://github.com/user-attachments/assets/d12aca32-9e6d-4b4e-b27f-219525332d28" />  

---

# Admin Interface  

- Requires authentication before access.  

<img width="1881" height="1014" alt="image" src="https://github.com/user-attachments/assets/2aafb009-09ce-4ed4-ba6f-07163d81c36e" />  

- Once logged in, admins can manage flights:  
  - Add new flights  
  - Delete existing flights  

<img width="1881" height="1014" alt="image" src="https://github.com/user-attachments/assets/7006e8c0-3f48-4707-a3d7-ff9359b9efec" />
