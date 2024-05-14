var express = require('express');
var router = express.Router();

const auth = require('../auth/auth');
const { uploadStoryMedia } = require('../uploadFile/uploadFile');
const StoryController = require('../app/controllers/StoryController');

router.get('/', auth, StoryController.getStories);
router.get('/seen-stories', auth, StoryController.getSeenStories);
router.get('/story-songs', auth, StoryController.getStorySongs);
router.post('/seen-stories', auth, StoryController.insertSeenStory);
router.post('/', auth, uploadStoryMedia.array('storyMedia', 2), StoryController.postStory);
router.delete('/:story_id', auth, StoryController.deleteStory);

module.exports = router;
