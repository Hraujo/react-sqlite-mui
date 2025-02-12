import { Button, Card, CardActions, CardContent, CardHeader, Paper } from "@mui/material";
import { CustomCenterDiv } from "../components/custom/CustomCenterDiv";


export function Profile() {
 return(
 <CustomCenterDiv>
 <Card component={Paper} elevation={4}>
    <CardHeader title='Profile' className="bg-gray" />
       <CardContent >

 <h1> Profile Page </h1>
       </CardContent>
       <CardActions className="bg-gray"> <Button>Button</Button></CardActions>
 </Card>
 </CustomCenterDiv>
 );
}
