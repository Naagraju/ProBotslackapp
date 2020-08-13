const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
const app = express();// The port used for Express server
const port = process.env.PORT || 5000;
//const { App } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');

var schedule = require('node-schedule');
hoursS='';


const {createMessageAdapter} = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

const token = process.env.SLACK_MYAPP_TOKEN;

const web = new WebClient(token);

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
	
app.use('/slack/events', slackEvents.expressMiddleware());
app.use('/slack/actions', slackInteractions.expressMiddleware());


// Reminder Modal Submission using interactive adapter
slackInteractions.viewSubmission('Reminder_modal_submit' , async (payload) => {
      //global.hoursS=0;
	  const blockData = payload.view.state;
    //console.log(blockData);
      const dateselectedvalue = blockData.values.date_selection_block.date_selection_element.selected_date;
	  const timepicker = blockData.values.time_selection_block.time_selection_element.selected_option.text.text;
	  
	  //const cuteAnimalSelection = blockData.values.cute_animal_selection_block.cute_animal_selection_element.selected_option.value
      //const nameInput = blockData.values.cute_animal_name_block.cute_animal_name_element.value
    const desc_reminder = blockData.values.description_selection_block.description_element.value;
      console.log(timepicker);
	  console.log(dateselectedvalue);
	 hoursS= `${timepicker}`.replace(/[\:00\']+/g,'');
	  console.log(hoursS);
    
      try {
		await web.chat.postMessage({
		channel: '#welcome',
		text: `:thumbsup:I will remind you " ${desc_reminder}" at ${timepicker}, ${dateselectedvalue} !!`	
	  });
		reminderpro();
		} catch (e){
console.log(e);
} 

	  return ''
	  //return hoursS;
    
  });

	  //console.log(hoursS);


function reminderpro() {
  const params = {
}
//console.log(hoursS);
var rule = new schedule.RecurrenceRule();
rule.second = 0;
rule.minute = 15;
rule.hour = hoursS;

//rule.date = 11;
//rule.month = 08;
//rule.year = 2020;
 
//var date = new Date(2020, 8, 11, 16, 4, 0);
var j1 = schedule.scheduleJob(rule, function(){
  console.log('This is from out side reminder time, i have confired time , and current time is '+ new Date());
  
  web.chat.postMessage({
      channel: '#welcome',
      text: `Hi, This is Reminder from ProBot`,
      blocks:[
	     {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "###Reminder Title###"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Reminder for:*\n######Reminder Discription#####\n*When:*\nAug 10-Aug 13"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlIERozfshCjDEs8u9U5PLqKtj_hJPk1aZnQ&usqp=CAU",
				"alt_text": "Reminder thumbnail"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Mark as Complete",
						"emoji": true
					},
					"value": "click_me_123"
				}
			]
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Delete",
						"emoji": true
					},
					"value": "click_me_123"
				}
			]
		}
	]

});
  });
}


// Announcement Modal Submission using interactive adapter
slackInteractions.viewSubmission('Announcement_modal_submit' , async (payload) => {
      const blockData = payload.view.state;
    //console.log(blockData);
      var channelselectedvalue = blockData.values.Channels_selection_block.channels.selected_channels;
	   //supparate square brackets using regexp
	  //var WithOutBrackets="[test]".replace(/[\[\]']+/g,'');
	  var channel=`${channelselectedvalue}`.replace(/[\[\]']+/g,'');
	  		
    const message = blockData.values.Message_block.description_element.value;
      //console.log(channelselectedvalue);
	  
	  //console.log(message);
    //console.log(hoursS);
      try {
		await web.chat.postMessage({
		channel: channel,
		text: `:thumbsup:${message} !!`	
	  });	
		} catch (e){
console.log(e);
} 
	  return ''
    
	});


// To-Do-Task Modal Submission using interactive adapter
slackInteractions.viewSubmission('ToDoTask_modal_submit' , async (payload) => {
      const blockData = payload.view.state;
    //console.log(blockData);
      var userselectedvalue = blockData.values.users_selection_block.users.selected_users;
	   //supparate square brackets using regexp
	  //var WithOutBrackets="[test]".replace(/[\[\]']+/g,'');
	  var users=`${userselectedvalue}`.replace(/[\[\]']+/g,'');
	  		
    const message = blockData.values.Taskdesc_selection_block.description_element.value;
      console.log(userselectedvalue);
	  console.log(users);
	  
	  console.log(message);
    
      try {
		await web.chat.postMessage({
		channel: users,
		text: `:thumbsup:${message} !!`	
	  });	
		} catch (e){
console.log(e);
} 
	  return ''
    
	});



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Starts server
    app.listen(port, function() {
      console.log('ProBot is listening on port ' + port);
    });
	


slackEvents.on('app_mention', async (event) => {
      try {
	await web.chat.postMessage({
      channel: '#welcome',
      text: `Hi, Welcome to my World`,
      blocks: [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hey there 👋 I'm ProBot. \nProBot makes it easy to manage your team tasks, directly in Slack."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*1️⃣ Use the `Remindpro` command*. Create reminders in professional way for your Team or your self. Type `/remindpro` followed by a short description of your reminder context and I'll ask for a due date & time (if applicable). Try it out by using the `/remindpro` command in this channel."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*2️⃣ Use the `Information Center` command*. To know the all importenat URL's information. Just Type `/inforoom` "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*3️⃣ Use the `To Do task` command*. Type `/todotask` followed by a short description of your tasks and I'll ask for a due date (if applicable). "
			}
		
		},

		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*4️⃣ Use the `Announcements` command*. Type `/publish` followed by a description of your announcements and pick a channel / Team member on the right dropdown. "
			}
		
		},
	
		{
			"type": "divider"
		}
			]

});
      console.log("I got a mention in this channel", event.channel);
      } catch (e){
console.log(e);
} 
});


// Reminder Modal

const modalRemindertestBlock = {
	"type": "modal",
	"callback_id": "Reminder_modal_submit",
	"title": {
		"type": "plain_text",
		"text": "Create a Reminder",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Create",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "input",
			"block_id": "date_selection_block",
			"element": {
				"type": "datepicker",
				"action_id": "date_selection_element",
				"initial_date": "2020-07-22",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a date",
					"emoji": true
				}
			},
			"label": {
				"type": "plain_text",
				"text": "When",
				"emoji": true
			}
		},
		{
			"type": "input",
			"block_id": "time_selection_block",
			"element": {
				"type": "static_select",
				"action_id": "time_selection_element",
				"placeholder": {
					"type": "plain_text",
					"text": "Pick a Time",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "1:00",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "2:00",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "3:00",
							"emoji": true
						},
						"value": "value-3"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "4:00",
							"emoji": true
						},
						"value": "value-4"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "5:00",
							"emoji": true
						},
						"value": "value-5"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "6:00",
							"emoji": true
						},
						"value": "value-6"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "7:00",
							"emoji": true
						},
						"value": "value-7"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "8:00",
							"emoji": true
						},
						"value": "value-8"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "9:00",
							"emoji": true
						},
						"value": "value-9"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "10:00",
							"emoji": true
						},
						"value": "value-10"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "11:00",
							"emoji": true
						},
						"value": "value-11"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "12:00",
							"emoji": true
						},
						"value": "value-12"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "13:00",
							"emoji": true
						},
						"value": "value-13"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "14:00",
							"emoji": true
						},
						"value": "value-14"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "15:00",
							"emoji": true
						},
						"value": "value-15"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "16:00",
							"emoji": true
						},
						"value": "value-16"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "17:00",
							"emoji": true
						},
						"value": "value-17"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "18:00",
							"emoji": true
						},
						"value": "value-18"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "19:00",
							"emoji": true
						},
						"value": "value-19"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "20:00",
							"emoji": true
						},
						"value": "value-20"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "21:00",
							"emoji": true
						},
						"value": "value-21"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "22:00",
							"emoji": true
						},
						"value": "value-22"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "23:00",
							"emoji": true
						},
						"value": "value-23"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "24:00",
							"emoji": true
						},
						"value": "value-24"
					}
				]
			},
			"label": {
				"type": "plain_text",
				"text": "Time",
				"emoji": true
			}
		},
		{
			"type": "input",
			"block_id": "description_selection_block",
			"element": {
				"type": "plain_text_input",
				"action_id": "description_element",
				"multiline": true
			},
			"label": {
				"type": "plain_text",
				"text": "Description",
				"emoji": true
			}
		}
	]
}

//Slash command: '/remindpro'
app.post('/remindpro', (req, res) => {
	//console.log('payload from slash command enter', payload);
	console.log('*Reminder Modal Launched*......');
	//console.log('***view id****', req.view.id);
	
	
		   web.views.open({
           trigger_id: req.body.trigger_id,
          view: modalRemindertestBlock
						});
						
//(async () => {

   //const result = await web.views.open({
	  // trigger_id: req.body.trigger_id,
         //   view: modalRemindertestBlock
						//});
		////console.log(`Successfully opened root view ${result.view.id}`);
		//const vid = result.view.id;
		//console.log('again vid', vid);
		
		//const result1 = await web.views.update({
			//view_id: vid,
			//view: modalRemindertestBlock
      
  
		//});
//})();
	   
	   //console.log('vid is', vid);
							
//res.json();
res.send();
});



//@@@@@@@@@@@@@reminder test code

// var date = new Date(year,month,date,hour,min,sec)


var j = schedule.scheduleJob('*/5 * * * *', function(){
  console.log('This message will display every 5 minites, Current time is :' + new Date());
});

var rule = new schedule.RecurrenceRule();
rule.second = 0;
rule.minute = 59;
rule.hour = 20;
//rule.date = 14;
//rule.month = 07;
//rule.year = 2020;
 
var j1 = schedule.scheduleJob(rule, function(){
  console.log('This is time, i have confired time , and current time is '+ new Date());
  
  web.chat.postMessage({
      channel: '#welcome',
      text: `Hi, Welcome to my World`,
      blocks:[
	     
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "###Reminder Title###"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Reminder for:*\n######Reminder Discription#####\n*When:*\nAug 10-Aug 13"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlIERozfshCjDEs8u9U5PLqKtj_hJPk1aZnQ&usqp=CAU",
				"alt_text": "Reminder thumbnail"
			}
		}
	]

});
  });




//Slash command: '/inforoom'
app.post('/inforoom', (req, res) => {
web.chat.postMessage({
      channel: '#welcome',
      text: `Hi, Welcome to my World`,
      blocks: [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "                           *INFORMATION WALL*"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Hours Billing info:*\n\n*<www.google.com|ILC>*\n*<https://ibmade.changepointasp.com/|Changepoint>*\n *<https://time.ibm.com/|Time@IBM>*"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQli1eZM06frON69jFwilgdYToCrI6pAFMIsw&usqp=CAU",
				"alt_text": "Hours Billing"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Trining urls info:*\n\n*<https://yourlearning.ibm.com/|Your Learning>*\n*<https://lexicon.in.ibm.com/Synergy/|Lexicon>*"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://academy.whatfix.com/wp-content/uploads/2019/06/Screen-Shot-2019-06-12-at-9.35.51-PM.png",
				"alt_text": "Hours Billing"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Learning Resources info*\n\n*<http://w3.ibm.com/academy|IBM Academy>*\n*<https://learning.oreilly.com/home/|Oreilly Learning>*"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://pbs.twimg.com/profile_images/1034459623720411137/2_lQ4F99_400x400.jpg",
				"alt_text": "Hours Billing"
			}
		},
		{
			"type": "divider"
		},
	]


});
res.json();
});

//Announcements Model
const modalAnnouncementBlock = {
	"type": "modal",
	"callback_id": "Announcement_modal_submit",
	"title": {
		"type": "plain_text",
		"text": "Announcement",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "input",
			"block_id": "Channels_selection_block",
			"element": {
				"type": "multi_channels_select",
				"action_id": "channels",
				"placeholder": {
					"type": "plain_text",
					"text": "Where should the message be sent?"
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Channel(s)"
			}
		},
		{
			"type": "input",
			"block_id": "Message_block",
			"element": {
				"type": "plain_text_input",
				"action_id": "description_element",
				"multiline": true
			},
			"label": {
				"type": "plain_text",
				"text": ":loudspeaker: Message",
				"emoji": true
			}
		}
	]
}

//Slash command: '/publish'
app.post('/publish', (req, res) => {
	console.log('*Announcement Modal Launched*...');
web.views.open({
            trigger_id: req.body.trigger_id,
            view: modalAnnouncementBlock
           });
res.json();
});


//Todo Task Model
const modalTodotaskBlock = {
	"callback_id": "ToDoTask_modal_submit",
	"title": {
		"type": "plain_text",
		"text": "To Do Task"
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit"
	},
	"blocks": [
		{
			"type": "input",
			"block_id": "Taskdesc_selection_block",
			"element": {
				"type": "plain_text_input",
				"action_id": "description_element",
				"multiline": true
			},
			"label": {
				"type": "plain_text",
				"text": ":Book: Task Description",
				"emoji": true
			}
		},
		{
			"type": "input",
			"block_id": "users_selection_block",
			"element": {
				"type": "multi_users_select",
				"action_id": "users",
				"placeholder": {
					"type": "plain_text",
					"text": "Select Name",
					"emoji": true
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Team Member",
				"emoji": true
			}
		}
	],
	"type": "modal"
}

//Slash command: '/todotask'
app.post('/todotask', (req, res) => {
	console.log('*To-Do-Task Modal Launched*......');
			web.views.open({
            trigger_id: req.body.trigger_id,
            view: modalTodotaskBlock
						});
res.json();
});


slackInteractions.viewSubmission('todo_modal_submit' , async (payload) => {
      const blockData = payload.view.state;
    console.log('from todotask block',blockData);
          
      return {
        "response_action": "clear"
      }
    });	