# forecast-blog
Project 2

Pour your thoughts out

Description
Blog platform for TV Show lovers. A great place to put forth your thoughts about a particular
episode or discuss the prediction of the upcoming episodes

User stories
404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
500 - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
login-signup - As a user I want to see a welcome page that gives me the option to either log in as an existing user, or sign up with a new account.
add-signup - As a user I want to sign up with my full information so that I can post my thoughts about my favourite tv shows. 
homepage - As a user when I login, I want to see my favourite tv shows listed on my page. And also a button to 
edit / remove my favourite shows which (may or maynot delete my blogs related to that show) 
Favourite show search result - As a user I want to see the search results with a oreview image, the title and the number of series details. Also, to go back to the home page if I don't want to see that search anymore.
Add to Favourites button - As a user when I click on add to favourites button, that tv show should get added 
to the list of my favourite tv shows
Write a blog - As a user when I click on the favourite tv show in my profile, it takes me to a page where I can view all the blogs related to that show and add my blog.
Search for blog: In my profile, I should be able to search for any tv show and browse the blogs written by all 
the users for that tv show. 

BackLogs

- As a user I would be able to browse blogs and comment or like them
- An option to Delete or keep their blogs when they remove a tv show from their favourite shows. 
- Notifications if someone adds a blog or comment or likes their blog or comment
- Show other user profile - which shows all their favourite tv shows. 
- May be a chat option if the user is online. (Keep for end)

API routes (back-end)
GET /

renders index.hbs - Shows basic information and a tag line about the app and also shows options to login / signup

GET /auth/signup

shows signup.hbs, if the user is loggedIn, renders profile page

POST /auth/signup

redirects to home Page

body:
username
email
password
nickName

POST /auth/login

redirects to profile page if successful else shows error msg and redirect to login page

body:
email
password

POST /auth/logout

body: (empty)
renders home page

GET /profile

renders user-profile.hbs
redirects to / if user presses button
POST /profile (to edit profile)

redirects to /add-signup (we reuse it but for edit purposes)
body:
username
password

POST /profile (to add favourite tv show)

body:
tv show title
id

GET /notifications

renders notifications.hbs
redirects to /profile if user presses button

Models
User new Schema ({ _id: , email: String, required: true, password: String, minlength: 6, maxlength: 12, nickname: String, required: true,  } })

blogs new Schema ({ _id: , userRef: user._id, blog: String, required: true, min length: 10 })

Backlog - comments new Schema

Summary of product
User profile

Favourite tv shows list
Check a list of favourite tv shows


Links
[Trello Link]

Git
[Repository Link]

Deploy Link: https://forecast-blog.herokuapp.com/
