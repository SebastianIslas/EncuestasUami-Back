function ObjectId(str) {
    return str;
}

var cursos = [
    {
      _id: ObjectId("63c78717f02054450a31fb6a"),
      cursosSeleccionados: 
      [
        { curso: ObjectId("63a3587c9a16cb1f8af03a95") },
        { curso: ObjectId("63a3587d9a16cb1f8af03ad3") },
        { curso: ObjectId("63a3587f9a16cb1f8af03b0d") },
        { curso: ObjectId("63a358809a16cb1f8af03b39") },
        { curso: ObjectId("63a358809a16cb1f8af03b53") }
      ]
    },
    {
      _id: ObjectId("63c78718f02054450a31fb7d"),
      cursosSeleccionados: 
      [
        { curso: ObjectId("63a3587c9a16cb1f8af03a9f") },
        { curso: ObjectId("63a358819a16cb1f8af03b5b") },
        { curso: ObjectId("63a358819a16cb1f8af03b69") },
        { curso: ObjectId("63a358829a16cb1f8af03b9d") },
        { curso: ObjectId("63a358829a16cb1f8af03ba7") }
      ]
    },
    {
      _id: ObjectId("63c78718f02054450a31fb90"),
      cursosSeleccionados: 
      [
        { curso: ObjectId("63a3587c9a16cb1f8af03a8f") },
        { curso: ObjectId("63a3587c9a16cb1f8af03aa3") },
        { curso: ObjectId("63a3587e9a16cb1f8af03af7") },
        { curso: ObjectId("63a358809a16cb1f8af03b39") },
        { curso: ObjectId("63a358809a16cb1f8af03b3b") }
      ]
    }
]

var idS = cursos.map(e => { return e.cursosSeleccionados}).flat().map(e => e.curso)



function mostCommonCurso(idS)
{
    if(idS.length == 0)
        return null;
    
    var modeMap = {};
    var maxEl = idS[0], maxCount = 1;
    for(var i = 0; i < idS.length; i++)
    {
        var el = idS[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

console.log(idS)
console.log( mostCommonCurso(idS))
