
export const colors = {
    A: "#8A2BE2",
    B: "#5F9EA0",
    C: "#8EE5EE",
    D: "#42426F",
    E: "#00BFFF",
    F: "#EEB4B4",
    G: "#FF4040",
    H: "#D2691E",
    I: "#4A766E",
    J: "#FF7F00",
    K: "#F08080",
    L: "#FF7256",
    M: "#FFA500",
    N: "#FF2400",
    O: "#FFB5C5",
    P: "#CD919E",
    Q: "#FF6347",
    R: "#B9FF66",
    S: "#E066FF",
    T: "#EAADEA",
    U: "#FFB90F",
    V: "#EEE9BF",
    W: "#EEEE00",
    X: "#CD0000",
    Y: "#CD8500",
    Z: "#607B8B",
  };
  
  export const getChartOption = (details) => {
    const excelCount =
      details?.sentReportCountByTypeDTOList?.find(
        (item) => item._id === "EXCEL"
      )?.count || 0;
    const csvCount =
      details?.sentReportCountByTypeDTOList?.find((item) => item._id === "CSV")
        ?.count || 0;
  
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: false,
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "60%"],
          label: {
            show: false,
            position: "inside",
            formatter: "{b}: {c}",
          },
          data: [
            {
              value: excelCount,
              name: "Excel",
              itemStyle: {
                color: "#B35CE1",
              },
            },
            {
              value: csvCount,
              name: "Csv",
              itemStyle: {
                color: "#0A9FFF",
              },
            },
          ],
        },
        {
          type: "pie",
          radius: ["0%", "30%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            formatter: `{b|${excelCount + csvCount}}`,
            backgroundColor: "transparent",
            rich: {
              a: {
                fontSize: 12,
              },
              b: {
                fontSize: 18,
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: excelCount + csvCount,
              name: "Total",
              itemStyle: {
                color: "#fff",
              },
            },
          ],
        },
      ],
    };
  };
  
  export const getRandomColor = (letter) => colors[letter.toUpperCase()] || "#B35CE1";
  
  export const getChartUserOption = (details) => {
    const data =
      details?.sentReportUserWiseCountDtoByRole?.sentReportUserWiseCountListForSupervisor?.map(
        (item) => ({
          value: item.userCount,
          name: `${item.userNameDTO?.firstName} ${item.userNameDTO?.lastName}`,
        })
      );
  
    const nameColors = {};
  
    data?.forEach((item) => {
      const firstLetter = item.name[0];
      if (!nameColors[item.name]) {
        nameColors[item.name] = getRandomColor(firstLetter);
      }
    });
  
    const pieData = data?.map((item) => ({
      value: item?.value,
      name: item?.name,
      itemStyle: {
        color: nameColors[item?.name],
      },
    }));
  
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: false,
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "60%"],
          label: {
            show: false,
            position: "inside",
            formatter: "{b}: {c}",
          },
          data: pieData,
        },
        {
          type: "pie",
          radius: ["0%", "30%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            formatter: `{b|${data?.reduce((acc, curr) => acc + curr.value, 0)}}`,
            backgroundColor: "transparent",
            rich: {
              a: {
                fontSize: 12,
              },
              b: {
                fontSize: 18,
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: data?.reduce((acc, curr) => acc + curr.value, 0),
              name: "Total",
              itemStyle: {
                color: "#fff",
              },
            },
          ],
        },
      ],
    };
  };
  
  export const getChartAdminOption = (details) => {
    const data =
      details?.sentReportUserWiseCountDtoByRole?.sentReportUserWiseCountListForAdmin?.map(
        (item) => ({
          value: item?.userCount,
          name: `${item?.userNameDTO?.firstName} ${item?.userNameDTO?.lastName}`,
        })
      );
  
    const nameColors = {};
  
    data?.forEach((item) => {
      const firstLetter = item.name[0];
      if (!nameColors[item.name]) {
        nameColors[item.name] = getRandomColor(firstLetter);
      }
    });
  
    const pieData = data?.map((item) => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: nameColors[item.name],
      },
    }));
  
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: false,
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "60%"],
          label: {
            show: false,
            position: "inside",
            formatter: "{b}: {c}",
          },
          data: pieData,
        },
        {
          type: "pie",
          radius: ["0%", "30%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            formatter: `{b|${data?.reduce((acc, curr) => acc + curr.value, 0)}}`,
            backgroundColor: "transparent",
            rich: {
              a: {
                fontSize: 12,
              },
              b: {
                fontSize: 18,
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: data?.reduce((acc, curr) => acc + curr.value, 0),
              name: "Total",
              itemStyle: {
                color: "#fff",
              },
            },
          ],
        },
      ],
    };
  };
  