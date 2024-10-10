import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DirectionsIcon from "@mui/icons-material/Directions";
import ShareIcon from "@mui/icons-material/Share";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CommentIcon from "@mui/icons-material/Comment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
} from "firebase/database";
import { auth } from "../../../firebase";
import Googlemap from "../../GoogleMap/GoogleMap";

const ResourceCard = ({ resource }) => {
  const user = auth.currentUser; // Get current logged-in user

  const [likes, setLikes] = useState({});
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentResource, setCurrentResource] = useState(null);
  const [showHours, setShowHours] = useState(null);
  const [openHours, setOpenHours] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [directionsVisible, setDirectionsVisible] = useState(false);
  const [directionsResource, setDirectionsResource] = useState(null);

  useEffect(() => {
    if (!user) return;

    const db = getDatabase();
    const likesRef = ref(db, "likes");

    const unsubscribe = onValue(likesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLikes(data);
      } else {
        setLikes({});
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleLike = (resourceName) => {
    if (!user) {
      toast.info("Please Log In To Like This Resource.");
      return;
    }

    const db = getDatabase();
    const likeRef = ref(db, `likes/${resourceName}`);

    const currentLikes = likes[resourceName] || { count: 0, users: [] };
    const userLiked = currentLikes.users.includes(user.uid);

    if (userLiked) {
      // Unlike
      const updatedUsers = currentLikes.users.filter((uid) => uid !== user.uid);
      const newCount = updatedUsers.length;

      set(likeRef, {
        count: newCount,
        users: updatedUsers,
      })
        .then(() => {
          setLikes((prev) => ({
            ...prev,
            [resourceName]: { count: newCount, users: updatedUsers },
          }));
          toast.success("You Unliked This Resource!");
        })
        .catch((error) => {
          toast.error("Error Unliking Resource: " + error.message);
        });
    } else {
      // Like
      const updatedUsers = [...currentLikes.users, user.uid];
      const newCount = updatedUsers.length;

      set(likeRef, {
        count: newCount,
        users: updatedUsers,
      })
        .then(() => {
          setLikes((prev) => ({
            ...prev,
            [resourceName]: { count: newCount, users: updatedUsers },
          }));
          toast.success("You Liked This Resource!");
        })
        .catch((error) => {
          toast.error("Error Liking Resource: " + error.message);
        });
    }
  };

  const handleClickOpen = (resource) => {
    setCurrentResource(resource);
    setOpen(true);

    // Fetch comments for the selected resource from Firebase
    const db = getDatabase();
    const commentsRef = ref(db, `comments/${resource.name}`);
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedComments = data
        ? Object.entries(data).map(([key, value]) => ({ id: key, ...value }))
        : [];
      setComments(fetchedComments);
    });
  };

  const handleClose = () => {
    setOpen(false);
    setComment("");
    setEditComment(false);
    setCurrentCommentId(null);
  };

  const handleSubmit = () => {
    const db = getDatabase();

    if (user) {
      if (editComment && currentCommentId) {
        const commentRef = ref(
          db,
          `comments/${currentResource.name}/${currentCommentId}`
        );
        set(commentRef, {
          userName: user.displayName || "Anonymous",
          comment,
          time: new Date().toLocaleString(),
        })
          .then(() => {
            toast.success("Comment Updated Successfully!");
            handleClose();
          })
          .catch((error) => {
            toast.error("Failed To Update Comment: " + error.message);
          });
      } else {
        const commentsRef = ref(db, `comments/${currentResource.name}`);
        const newCommentRef = push(commentsRef);

        set(newCommentRef, {
          userName: user.displayName || "Anonymous",
          comment,
          time: new Date().toLocaleString(),
        })
          .then(() => {
            toast.success("Comment Added Successfully!");
            handleClose();
          })
          .catch((error) => {
            toast.error("Failed To Add Comment: " + error.message);
          });
      }
    } else {
      toast.info("Please LogIn To Submit A Comment.");
    }
  };

  const handleDelete = (commentId) => {
    const db = getDatabase();
    const commentRef = ref(db, `comments/${currentResource.name}/${commentId}`);
    remove(commentRef)
      .then(() => {
        toast.success("Comment Deleted Successfully!");
      })
      .catch((error) => {
        toast.error("Error Deleting Comment: " + error.message);
      });
  };

  const handleEdit = (item) => {
    setComment(item.comment);
    setCurrentCommentId(item.id);
    setEditComment(true);
  };

  const handleDirections = (resource) => {
    setDirectionsResource(resource);
    setDirectionsVisible(true);
  };

  const handleCloseDirections = () => {
    setDirectionsVisible(false);
    setDirectionsResource(null);
  };

  const handleShowHours = (resource) => {
    setShowHours(resource);
    setOpenHours(true);
  };

  const handleCloseHours = () => {
    setOpenHours(false);
    setShowHours(null);
  };

  return (
    <>
      {resource?.map((resource, index) => {
        const resourceLikes = likes?.[resource?.name] || {
          count: 0,
          users: [],
        };
        const isLiked = user
          ? resourceLikes?.users?.includes(user?.uid)
          : false;
        return (
          <Card
            key={index}
            sx={{
              maxWidth: 345,
              margin: "auto",
              borderRadius: "10px",
              backgroundColor: "rgba(243, 239, 230, 1)",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "0.3s",
              },
              marginBottom: "30px",
            }}
          >
            <CardHeader
              avatar={
                <Avatar aria-label="resource" sx={{ bgcolor: "#8e24aa" }}>
                  {resource.name.charAt(0)}
                </Avatar>
              }
              title={resource.name}
            />
            {resource.photoUrl ? (
              <CardMedia
                component="img"
                height="194"
                image={resource.photoUrl}
                alt={resource.name}
              />
            ) : (
              <CardMedia
                component="img"
                height="194"
                image="https://via.placeholder.com/400x300.png?text=No+Image+Available"
                alt={resource.name}
              />
            )}

            <CardContent>
              <Typography
                variant="body2"
                sx={{ mt: 1, mb: 1, textAlign: "left" }}
              >
                <strong>Address : </strong> {resource.address}
              </Typography>
              <Divider />

              <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
                <EmailIcon sx={{ mr: 1 }} color="error" />
                {resource.email}
              </Box>

              <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
                <PhoneIcon sx={{ mr: 1 }} />
                {resource.phone}
              </Box>
            </CardContent>

            <Box
              sx={{
                p: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Tooltip title={isLiked ? "Unlike" : "Like"}>
                  <IconButton
                    onClick={() => handleLike(resource.name)}
                    color={isLiked ? "error" : "default"}
                  >
                    {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Comments">
                  <IconButton onClick={() => handleClickOpen(resource)}>
                    <CommentIcon color="primary" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Operating Hours">
                  <IconButton onClick={() => handleShowHours(resource)}>
                    <AccessTimeIcon color="warning" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share">
                  <IconButton>
                    <ShareIcon color="success" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Directions">
                  <IconButton onClick={() => handleDirections(resource)}>
                    <DirectionsIcon color="info" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="body2" color="secondary">
                {resourceLikes.count}{" "}
                {resourceLikes.count === 1 ? "like" : "likes"}
              </Typography>
            </Box>
          </Card>
        );
      })}

      <Dialog fullWidth open={openHours} onClose={handleCloseHours}>
        <DialogTitle
          sx={{
            bgcolor: "#f5f5f5",
            color: "#333",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {resource.name} Operating Hours
        </DialogTitle>

        <Divider />

        <DialogContent dividers sx={{ py: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {showHours?.time?.split(",")?.map((item, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  fontSize: "16px",
                  color: "#555",
                  textAlign: "center",
                }}
              >
                {item?.trim()}
              </Typography>
            ))}
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ py: 2 }}>
          <Button
            size="medium"
            color="primary"
            variant="outlined"
            sx={{ textTransform: "none" }}
            onClick={handleCloseHours}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={directionsVisible}
        onClose={handleCloseDirections}
        fullWidth
      >
        <DialogTitle>Directions to {directionsResource?.name}</DialogTitle>
        <Divider />
        <DialogContent>
          <Googlemap
            center={{
              lat: directionsResource?.lat,
              lng: directionsResource?.lng,
            }}
            destination={{
              lat: directionsResource?.lat,
              lng: directionsResource?.lng,
            }}
            directions={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDirections} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle
          sx={{ bgcolor: "#f5f5f5", color: "#333", textAlign: "center" }}
        >
          {editComment ? "Edit Your Comment" : "Add a Comment"}
        </DialogTitle>

        <Divider />

        <DialogContent dividers sx={{ py: 3 }}>
          <Box sx={{ mb: 3 }}>
            {comments.length > 0 ? (
              comments.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    mb: 2,
                    bgcolor: "#f9f9f9",
                    p: 2,
                    borderRadius: 1,
                    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CardHeader
                        avatar={
                          <Avatar
                            aria-label="resource"
                            sx={{ bgcolor: "#8e24aa" }}
                          >
                            {item.userName?.charAt(0)}
                          </Avatar>
                        }
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          {item.userName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          {item.comment}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      {item.time}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      gap: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {user && user.displayName === item.userName && (
                      <>
                        <Button
                          size="medium"
                          color="primary"
                          variant="outlined"
                          sx={{ textTransform: "none" }}
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="medium"
                          color="error"
                          variant="outlined"
                          sx={{ textTransform: "none" }}
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: "center" }}
              >
                No Comments Available
              </Typography>
            )}
          </Box>

          <TextField
            rows={4}
            fullWidth
            multiline
            value={comment}
            variant="outlined"
            label={editComment ? "Edit Your Comment" : "Your Comment"}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button
            size="medium"
            color="error"
            variant="outlined"
            onClick={handleClose}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            size="medium"
            color="primary"
            variant="outlined"
            onClick={handleSubmit}
            sx={{ textTransform: "none" }}
          >
            {editComment ? "Update Comment" : "Add Comment"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResourceCard;
