import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Switch, message } from 'antd';
import './Classroom.less';
import NavBar from '../../../components/NavBar/NavBar';
import Roster from './Roster/Roster';
import Home from './Home/Home';
import SavedWorkSpaceTab from '../../../components/Tabs/SavedWorkspaceTab';
import { useSearchParams, useParams } from 'react-router-dom';

const { TabPane } = Tabs;

const getRecordings = async (classroomId) => {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve({
              data: [
                  { id: 1, name: 'Hogwart Healing Potion', status: 'active', privacy: 'public' },
                  { id: 2, name: 'Hogwart Harming Potion II', status: 'inactive', privacy: 'private' },
              ]
          });
      }, 1000);
  });
};

const updateRecordingStatus = (recordingId, newStatus) => {
  console.log(`Updated recording ${recordingId} to status ${newStatus}`);
};

const updatePrivacySetting = (recordingId, newSetting) => {
  console.log(`Updated recording ${recordingId} to privacy setting ${newSetting}`);
};

export default function Classroom({
  handleLogout,
  selectedActivity,
  setSelectedActivity,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const tab = searchParams.get('tab');
  const viewing = searchParams.get('viewing');

  useEffect(() => {
    sessionStorage.setItem('classroomId', id);
  }, [id]);

  
function RecordingManagementTab({ classroomId }) {
  const [recordingsList, setRecordingsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRecordings(classroomId);
      setRecordingsList(response.data);
    };
    fetchData();
  }, [classroomId]);

  const handleStatusChange = (recordingId, checked) => {
    const newStatus = checked ? 'active' : 'inactive';
    updateRecordingStatus(recordingId, newStatus);
  };

  const handlePrivacyChange = (recordingId, checked) => {
    const newSetting = checked ? 'public' : 'private';
    updatePrivacySetting(recordingId, newSetting);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Switch 
          checked={record.status === 'active'} 
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: 'Privacy',
      key: 'privacy',
      render: (_, record) => (
        <Switch 
          checked={record.privacy === 'public'} 
          onChange={(checked) => handlePrivacyChange(record.id, checked)}
        />
      ),
    },
  ];

  return (
    <div>
          <div id='page-header'>
            <h1>Saved Recordings</h1>
          </div>
          <div
            id='content-creator-table-container'
            style={{ marginTop: '6.6vh' }}
          >
      <Table dataSource={recordingsList} columns={columns} rowKey="id" />
      </div>
    </div>
  );
}


  return (
    <div className='container nav-padding'>
      <NavBar isMentor={true} />
      <Tabs
        defaultActiveKey={tab ? tab : 'home'}
        onChange={(key) => setSearchParams({ tab: key })}
      >
        <TabPane tab='Home' key='home'>
          <Home
            classroomId={parseInt(id)}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            viewing={viewing}
          />
        </TabPane>
        <TabPane tab='Roster' key='roster'>
          <Roster handleLogout={handleLogout} classroomId={id} />
        </TabPane>
        <TabPane tab='Saved Workspace' key='no'>
          <SavedWorkSpaceTab
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            classroomId={id}
          />
        </TabPane>
        <TabPane tab='Record Code Replay & Walkthrough' key='recordReplay'>
          <RecordingManagementTab classroomId={id} />
        </TabPane>
      </Tabs>
    </div>
  );
}
