var _ = require('lodash');
var diff = require('deep-diff').diff;

var a ={
  "EventID": "ORC5296810",
  "EventClass": 1,
  "EventState": 255,
  "StartDateTime": "2013-10-21T09:15:14-04:00",
  "EndDateTime": "2014-04-18T23:59:59-04:00",
  "LastUpdate": "2014-04-11T15:30:34-04:00",
  "EventTypes": {
    "EventType": "roadwork"
  },
  "SummaryDescription": "NYSDOT - Region 8: roadwork on NY 119 both directions between Knollwood Road; NY 100A &amp;&#35;40;Greenburgh&#41; and Winthrop Avenue (Greenburgh) , Monday April 14th, 2014 thru Friday April 18th, 2014, Monday thru Friday, 07:00 AM thru 03:30 PM, various lane closures",
  "ReportingOrg": 1064,
  "EventLocationInfo": {
    "Facility": "NY 119",
    "Direction": "both directions",
    "City": "Greenburgh",
    "County": "Westchester",
    "State": "NY",
    "LocationDetails": {
      "LocationItem": [
        {
          "Intersections": {
            "PrimaryLoc": "Knollwood Road; NY 100A",
            "SecondaryLoc": "Winthrop Avenue",
            "Article": "between"
          }
        },
        {
          "PointCoordinates": {
            "Datum": "NAD83",
            "Lat": 41.0455017089844,
            "Lon": -73.804801940918
          }
        },
        {
          "AssociatedCities": {
            "PrimaryCity": "Greenburgh",
            "Article": "between"
          }
        }
      ]
    }
  },
  "AdditionalData": {
    "DataItem": [
      {
        "Type": "OR_TrackingID",
        "Data": "ORC-5296810"
      },
      {
        "Type": "xcm_Source",
        "Data": "NY OpenReach"
      },
      {
        "Type": "xcm_Local",
        "Data": false
      },
      {
        "Type": "xcm_Transit",
        "Data": false
      },
      {
        "Type": "xcm_FacilityID",
        "Data": 214
      },
      {
        "Type": "xcm_CountyTo",
        "Data": "Westchester"
      },
      {
        "Type": "xcm_EarliestScheduleStart",
        "Data": "2014-04-14T07:00:00-04:00"
      },
      {
        "Type": "xcm_LatestScheduleEnd",
        "Data": "2014-04-18T15:30:00-04:00"
      },
      {
        "Type": "xcm_EventID",
        "Data": 2013102109151301000
      },
      {
        "Type": "xcm_ReportingOrgName",
        "Data": "NYSDOT - Region 8"
      },
      {
        "Type": "xcm_UpdateCount",
        "Data": 71
      },
      {
        "Type": "xcm_RaEventType",
        "Data": "Roadwork"
      },
      {
        "Type": "xcm_ShortDesc",
        "Data": "NYSDOT - Region 8: roadwork on NY 119 both directions between Knollwood Road; NY 100A &amp;&#35;40;Greenburgh&#41; and Winthrop Avenue (Greenburgh) , Monday April 14th, 2014 thru Friday April 18th, 2014, Monday thru Friday, 07:00 AM thru 03:30 PM, various lane closures"
      },
      {
        "Type": "xcm_SortCategory",
        "Data": "A040.200.196"
      },
      {
        "Type": "xcm_SortOrder",
        "Data": 40
      },
      {
        "Type": "xcm_PresentationHint",
        "Data": "construction.gif"
      }
    ]
  },
  "ScheduleInfo": {
    "Schedules": {
      "Schedule": {
        "ScheduleID": 1,
        "ScheduleStartDateTime": "2014-04-14T07:00:00-04:00",
        "ScheduleEndDateTime": "2014-04-18T15:30:00-04:00",
        "Continuous": false,
        "ActiveDays": {
          "DayOfWeek": [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri"
          ]
        },
        "ScheduleLaneDetails": {
          "LanesStatus": "closures"
        },
        "ScheduleAdditionalData": {
          "DataItem": [
            {
              "Type": "OR_LanesDescription",
              "Data": "various lane"
            },
            {
              "Type": "OR_IncidentImpact",
              "Data": "Minor"
            }
          ]
        }
      }
    }
  }
}


var b = {
  "ScheduleInfo": {
    "Schedules": {
      "Schedule": [
        {
          "ScheduleAdditionalData": {
            "DataItem": [
              {
                "Data": "various lane",
                "Type": "OR_LanesDescription"
              },
              {
                "Data": "Minor",
                "Type": "OR_IncidentImpact"
              }
            ]
          },
          "ScheduleLaneDetails": {
            "LanesStatus": "closures"
          },
          "ActiveDays": {
            "DayOfWeek": [
              "Wed",
              "Thu",
              "Fri"
            ]
          },
          "Continuous": false,
          "ScheduleEndDateTime": "2014-04-11T15:30:00-04:00",
          "ScheduleStartDateTime": "2014-04-09T07:00:00-04:00",
          "ScheduleID": 1
        },
        {
          "ScheduleAdditionalData": {
            "DataItem": [
              {
                "Data": "various lane",
                "Type": "OR_LanesDescription"
              },
              {
                "Data": "Minor",
                "Type": "OR_IncidentImpact"
              }
            ]
          },
          "ScheduleLaneDetails": {
            "LanesStatus": "closures"
          },
          "ActiveDays": {
            "DayOfWeek": [
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri"
            ]
          },
          "Continuous": false,
          "ScheduleEndDateTime": "2014-04-18T15:30:00-04:00",
          "ScheduleStartDateTime": "2014-04-14T07:00:00-04:00",
          "ScheduleID": 2
        }
      ]
    }
  },
  "AdditionalData": {
    "DataItem": [
      {
        "Data": "ORC-5296810",
        "Type": "OR_TrackingID"
      },
      {
        "Data": "NY OpenReach",
        "Type": "xcm_Source"
      },
      {
        "Data": false,
        "Type": "xcm_Local"
      },
      {
        "Data": false,
        "Type": "xcm_Transit"
      },
      {
        "Data": 214,
        "Type": "xcm_FacilityID"
      },
      {
        "Data": "Westchester",
        "Type": "xcm_CountyTo"
      },
      {
        "Data": "2014-04-09T07:00:00-04:00",
        "Type": "xcm_EarliestScheduleStart"
      },
      {
        "Data": "2014-04-18T15:30:00-04:00",
        "Type": "xcm_LatestScheduleEnd"
      },
      {
        "Data": 2013102109151301000,
        "Type": "xcm_EventID"
      },
      {
        "Data": "NYSDOT - Region 8",
        "Type": "xcm_ReportingOrgName"
      },
      {
        "Data": 71,
        "Type": "xcm_UpdateCount"
      },
      {
        "Data": "Roadwork",
        "Type": "xcm_RaEventType"
      },
      {
        "Data": "NYSDOT - Region 8: roadwork on NY 119 both directions between Knollwood Road; NY 100A &amp;&#35;40;Greenburgh&#41; and Winthrop Avenue (Greenburgh) , Wednesday April 9th, 2014 thru Friday April 11th, 2014 Wednesday/ Thursday/ Friday, 07:00 AM thru 03:30 PM, various lane",
        "Type": "xcm_ShortDesc"
      },
      {
        "Data": "A040.200.196",
        "Type": "xcm_SortCategory"
      },
      {
        "Data": 40,
        "Type": "xcm_SortOrder"
      },
      {
        "Data": "construction.gif",
        "Type": "xcm_PresentationHint"
      }
    ]
  },
  "EventLocationInfo": {
    "LocationDetails": {
      "LocationItem": [
        {
          "Intersections": {
            "Article": "between",
            "SecondaryLoc": "Winthrop Avenue",
            "PrimaryLoc": "Knollwood Road; NY 100A"
          }
        },
        {
          "PointCoordinates": {
            "Lon": -73.804801940918,
            "Lat": 41.0455017089844,
            "Datum": "NAD83"
          }
        },
        {
          "AssociatedCities": {
            "Article": "between",
            "PrimaryCity": "Greenburgh"
          }
        }
      ]
    },
    "State": "NY",
    "County": "Westchester",
    "City": "Greenburgh",
    "Direction": "both directions",
    "Facility": "NY 119"
  },
  "ReportingOrg": 1064,
  "SummaryDescription": "NYSDOT - Region 8: roadwork on NY 119 both directions between Knollwood Road; NY 100A &amp;&#35;40;Greenburgh&#41; and Winthrop Avenue (Greenburgh) , Wednesday April 9th, 2014 thru Friday April 11th, 2014 Wednesday/ Thursday/ Friday, 07:00 AM thru 03:30 PM, various lane closures, Monday April 14th, 2014 thru Friday April 18th, 2014, Monday thru Friday, 07:00 AM thru 03:30 PM, various lane closures",
  "EventTypes": {
    "EventType": "roadwork"
  },
  "LastUpdate": "2014-04-08T06:13:41-04:00",
  "EndDateTime": "2014-04-18T23:59:59-04:00",
  "StartDateTime": "2013-10-21T09:15:14-04:00",
  "EventState": 255,
  "EventClass": 1,
  "EventID": "ORC5296810"
}

var differences = diff(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)));
console.log(JSON.stringify(a).length);
console.log(JSON.stringify(b).length);
console.log(_.isEqual(JSON.stringify(a), JSON.stringify(b)));
console.log(differences);