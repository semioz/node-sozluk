import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  sozluk: {
    color:"#68a063"
  },

  appBar: {
    display:"flex",
    padding: "20px 10px 20px 10px",
    width:"100%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#2C3333",
    borderTop:"4px solid #yellow"
  },
  heading: {
    color: '#EEEEEE',
    fontFamily: 'Poppins, sans-serif',
    marginRight:"900px"
  },
  image: {
    marginLeft: '10px',
  },
}));