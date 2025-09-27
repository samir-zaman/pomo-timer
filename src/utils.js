const formattedDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().slice(0, 10); 
  };

export { formattedDate }