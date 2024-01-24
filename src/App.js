import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

const handleUpload = () => {
  if (uploadList.length === 0) {
      setVisibleAlert(true);
  } else {
      console.log('Uploading files to S3');
      let i, progressBar = [], uploadCompleted = [];
      for (i = 0; i < uploadList.length; i++) {
          // If the user has removed some items from the Upload list, we need to correctly reference the file
          const id = uploadList[i].id;
          progressBar.push(progressBarFactory(fileList[id]));
          setHistoryCount(historyCount + 1);
          uploadCompleted.push(Storage.put(fileList[id].name, fileList[id], {
                  progressCallback: progressBar[i],
                  level: "protected"
              }).then(result => {
                  // Trying to remove items from the upload list as they complete. Maybe not work correctly
                  // setUploadList(uploadList.filter(item => item.label !== result.key));
                  console.log(`Completed the upload of ${result.key}`);
              })
          );
      }
      // When you finish the loop, all items should be removed from the upload list
      Promise.all(uploadCompleted)
          .then(() => setUploadList([]));
  }
}

function App(signOut,user) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>hello</h2>
        {user?(
          <>
          <button onClick={handleUpload}></button>
          <h3>権限を持っています{user.username}</h3>
          <button onClick={signOut}></button>
          </>
        ):(
          <h3>権限がない</h3>
        )

        }

        
      </header>
    </div>

  );
}

export default withAuthenticator(App);
